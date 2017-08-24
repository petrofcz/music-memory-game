/**
 * Created by tux on 23.8.2017.
 */

/**
 * Simple player that provides ability to play chords and melodies.
 * @param pathToAssets
 * @constructor
 */
function SimplePlayer(pathToAssets) {

    var noteMapping = {
        'Cb':   0,
        'C':    1,
        'C#':   2,
        'Db':   2,
        'D':    3,
        'D#':   4,
        'Eb':   4,
        'E':    5,
        'Fb':   5,
        'E#':   6,
        'F':    6,
        'F#':   7,
        'Gb':   7,
        'G':    8,
        'G#':   9,
        'Ab':   9,
        'A':    10,
        'A#':   11,
        'Bb':   11,
        'B':    12,
        'B#':   13
    };

    this.elements = {
        long: [],
        short: []
    };

    this.stackSize = 4;
    this.currentStack = 0;

    // init standard audio elements
    for (var elementType in this.elements) {
        for(var stackI = 0; stackI < this.stackSize; stackI++) {
            this.elements[elementType][stackI] = [];
            for (i = 1; i <= 37; i++) {
                fileNumber = (i > 9 ? '' : '0') + i;
                var el = $('<audio preload="auto"><source src="' + pathToAssets + '/' + elementType + '-' + fileNumber + '.mp3' + '" type="audio/mpeg"/></audio>');
                el.appendTo($('body'));
                this.elements[elementType][stackI][i] = el[0];
            }
        }
    }

    // advanced - webkit audio api
    /*
    var pianoSounds = {
        long: [],
        short: []
    };

    window.AudioContext = window.AudioContext || window.webkitAudioContext;
    var audioContext = new AudioContext();
    for(soundType in pianoSounds) {
        fileNumber = (i > 9 ? '' : '0') + i;
        soundPaths = [];
        for(i = 1; i < 37; i++) {
            soundPaths.push(pathToAssets + '/' + elementType + '-' + fileNumber + '.mp3');
        }
        bufferLoader = new BufferLoader(
            audioContext,
            soundPaths,
            function (bufferList) {
                bufferList.unshift(0); // 1-indexed array
                pianoSounds[soundType] = bufferList;
            }
        );
        bufferLoader.load();
    }

    var clickSound;
    bufferLoader = new BufferLoader(
        audioContext,
        [pathToAssets + '/click.wav'],
        function (bufferList) {
            clickSound = bufferList[0];
        }
    );
    bufferLoader.load();

    function playBufferedSound(buffer, time) {
        var source = audioContext.createBufferSource();
        source.buffer = buffer;
        source.connect(audioContext.destination);
        source.start(time);
    }*/

    var fnNoteToIndex = function(noteValue) {
        var octave = noteValue.substr(-1);
        var note = noteValue.substr(0, noteValue.length - 1);
        return noteMapping[note] + (12 * (octave - 4));
    };

    this.playChord = function(notes, callback) {
        for(i in notes) {
            this.elements['long'][this.currentStack][fnNoteToIndex(notes[i])].play();
        }
        if(typeof callback != 'undefined') {
            setTimeout(callback, 2200);
        }
        this.currentStack = (this.currentStack + 1) % this.stackSize;
    };

    this.playMelody = function(notes, callback, stack) {
        if(typeof stack == "undefined") {
            this.currentStack = (this.currentStack + 1) % this.stackSize;
            stack = this.currentStack;
        }
        if(notes.length > 0) {
            var note = notes.shift();
            console.log(note + ' -> ' + fnNoteToIndex(note));
            this.elements['short'][stack][fnNoteToIndex(note)].play();
            var _this = this;
            setTimeout(function(){
               _this.playMelody(notes, callback, stack);
            }, 160);
        } else {
            if(typeof callback != 'undefined') {
                callback();
            }
        }
    };
}