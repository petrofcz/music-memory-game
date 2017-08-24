// Avoid `console` errors in browsers that lack a console.
(function() {
    var method;
    var noop = function () {};
    var methods = [
        'assert', 'clear', 'count', 'debug', 'dir', 'dirxml', 'error',
        'exception', 'group', 'groupCollapsed', 'groupEnd', 'info', 'log',
        'markTimeline', 'profile', 'profileEnd', 'table', 'time', 'timeEnd',
        'timeline', 'timelineEnd', 'timeStamp', 'trace', 'warn'
    ];
    var length = methods.length;
    var console = (window.console = window.console || {});

    while (length--) {
        method = methods[length];

        // Only stub undefined methods.
        if (!console[method]) {
            console[method] = noop;
        }
    }
}());

// Place any jQuery/helper plugins in here.
function shuffleArray(array) {
    var temp = [];
    var len=array.length;
    while(len){
        temp.push(array.splice(Math.floor(Math.random()*array.length),1)[0]);
        len--;
    }
    return temp;
}

var getObjectSize = function(obj) {
    var len = 0, key;
    for (key in obj) {
        if (obj.hasOwnProperty(key)) len++;
    }
    return len;
};

var getObjectKeys = function(obj) {
    var keys = [], key;
    for (key in obj) {
        if (obj.hasOwnProperty(key)) keys.push(key);
    }
    return keys;
};

/**
 * This function permutes array and returns the permuted array
 * @param keys Array Array to be permuted
 * @returns {Array}
 */
var permuteArray = function(keys) {
    var tmp, newi, out = [];
    for(i=0; i<keys.length; i++) out[i] = i;
    console.log(out);
    for(z=0; z<10; z++) {   // do the swapping for 10 times
        for (i = 0; i < out.length; i++) {    // switch randomly 2 elements
            newi =  Math.floor(Math.random() * (out.length-1));
            tmp = out[i];
            out[i] = out[newi];
            out[newi] = tmp;
        }
    }
    console.log(out);
    for(i = 0; i < out.length; i++){
        out[i] = keys[out[i]];
    }
    console.log(out);
    return out;
};

function doInherit(superClass, subClass) {
    subClass.prototype = Object.create(superClass.prototype);
    subClass.prototype.constructor = subClass;
    subClass.prototype.__superClass = superClass;
    for(i in superClass) subClass[i] = superClass[i];
}

String.prototype.capitalizeFirstLetter = function() {
    return this.charAt(0).toUpperCase() + this.slice(1);
};


// MUSIC extensions
$.extend(MUSIC, {

    // creates playable notes from array of Note
    normalizeNotes: function(notes){
        // normalize score
        if(notes.length > 0 && notes[0] instanceof Note) {
            normNotes = [];
            for(i in notes) {
                var t = notes[i].latin();
                var replacement = {
                    'Cx'    :   'D',    'Dx'    :   'E',    'Ex'    :   'F#',   'Fx'    :   'G',    'Gx'    :   'A',
                    'Ax'    :   'B',    'Bx'    :   'C#',
                    'Cbb'   :   'Bb',   'Dbb'   :   'C',    'Ebb'   :   'D',    'Fbb'    :  'Eb',   'Gbb'   :   'F',
                    'Abb'   :   'G',    'Bbb'   :   'A'
                };
                if(replacement.hasOwnProperty(t)) t = replacement[t];

                normNotes.push(t + (notes[i].octave()));
            }
        } else normNotes = notes;
        return normNotes;
    },
    createNotes4Rendering: function(notes, duration){
        // normalize score
        var lat;

        if(notes.length > 0 && notes[0] instanceof Note) {
            normNotes = [];
            for(i in notes) {
                var lat = notes[i].latin();
                lat = lat.replace('x', '##');
                normNotes.push(lat + '/' + (notes[i].octave()));
            }
        } else normNotes = notes;

        console.log(normNotes);

        var n = new Vex.Flow.StaveNote({ keys: normNotes, duration: duration });
        for(i in normNotes) {
            if(normNotes[i].indexOf('##') != -1) n.addAccidental(i, new Vex.Flow.Accidental('##'));
            else if(normNotes[i].indexOf('bb') != -1) n.addAccidental(i, new Vex.Flow.Accidental('bb'));
            else if(normNotes[i].indexOf('b') != -1) n.addAccidental(i, new Vex.Flow.Accidental('b'));
            else if(normNotes[i].indexOf('#') != -1) n.addAccidental(i, new Vex.Flow.Accidental('#'));
        }

        return n;
    },
    getRandomNote : function() {
        var rand = Math.floor(Math.random() * (MUSIC.commonNotes.length - 1));
        return MUSIC.commonNotes[rand];
    }
});

$.extend(Note.prototype, {
    chord :     function (type) {
        if(!MUSIC.chords.hasOwnProperty(type)) throw new Error('Unknown chord type set!');
        var notes = [];
        var chord = MUSIC.chords[type];
        for(i in chord) {
            notes.push(this.addNumericInterval(chord[i]));
        }
        return notes;
    },
    addNumericInterval :     function(numericInterval) {
        var map = {
            '1' : 'unison',             '1#':   'minor second',
            '2b': 'minor second',       '2':    'major second',     '2#':   'minor third',
            '3b': 'minor third',        '3':    'major third',      '3#':   'fourth',
            '4b': 'major third',        '4':    'fourth',           '4#':   'augmented fourth',
            '5b': 'augmented fourth',   '5':    'fifth',            '5#':   'minor sixth',
            '6b': 'minor sixth',        '6':    'major sixth',      '6#':   'minor seventh',
            '7b': 'minor seventh',      '7':    'major seventh',    '7#':   'unison'
        };

        var num = parseInt(numericInterval); // 2,3,..
        var add = numericInterval.slice(num.toString().length); // b,#,..
        var octaveShift = false;

        if(num >= 8){    // octave shift
            num -= 7;
            octaveShift = true;;
        }

        var p = num.toString() + add;

        if(!map.hasOwnProperty(p)) throw new Error('Invalid numeric interval set');

        var out = this.add(Interval.fromName(map[p]));
        if(octaveShift) out = out.add(Interval.fromName('octave'));
        return out;
    }
});

function PlayNotes(score, tempo, notesPerBeat) {
    MusicTracker.init({
        score: score,
        tempo: tempo,
        isPlaying: false,
        isLooping: false,
        hasMetronome: false,
        drumSample: samples.snare,
        notesPerBeat: notesPerBeat
    });

    MusicTracker.play();
}

var simplePlayer = new SimplePlayer('audio');
function PlayChord(notes, finishedCallback) {
    simplePlayer.playChord(notes, finishedCallback);
}
function PlayMelody(notes, finishedCallback) {
    simplePlayer.playMelody(notes, finishedCallback);
}