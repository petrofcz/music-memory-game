/**
 * Created by petrof on 23.6.2015.
 */
/**
 * @inherits BaseTask
 * @param tempo int BPM
 * @param abstract bool true if the tempo be randomized with every rendering
 * @constructor
 */
function RythmTask(tempo, abstract) {
    var _this = this;

    BaseTask.apply(this, arguments);

    this.tempo = tempo;
    this.abstract = typeof abstract == 'undefined' ? false : abstract;

    var doRandomize = function(){       // do the randomization
        _this.tempo = 60 + Math.floor(Math.random()*160);
    };

    // generate random rythm
    var rVex = [];
    var rAudio = [];
    var rVexTuplets = [];
    var rVexTies = [];
    var rVexBeams = [];
    var beatCount = 4 + Math.floor(Math.random()*3);
    var bcRemaining = beatCount + 1, i, maxIndex, index, el, rand;
    var tupletAssocIndex = {};

    // these must be sorted by effective duration
    var rythmElements = [
        { fVex:   '16',     effDur:   1/16,     fAudio: 1/16,       tuplet: false   },
        { fVex:   '8',      effDur:   1/8,      fAudio: 1/8,        tuplet: false   },
        { fVex:   '16',     effDur:   1/8,      fAudio: 1/24,       tuplet: 3       },
        { fVex:   '8d',     effDur:   3/16,     fAudio: 3/16,       tuplet: false   },
        { fVex:   '4',      effDur:   1/4,      fAudio: 1/4,        tuplet: false   },
        { fVex:   '8',      effDur:   1/4,      fAudio: 1/12,       tuplet: 3       },
        { fVex:   '4d',     effDur:   3/8,      fAudio: 3/8,        tuplet: false   },
        { fVex:   '2',      effDur:   1/2,      fAudio: 1/2,        tuplet: false   },
        { fVex:   '2d',     effDur:   3/4,      fAudio: 3/4,        tuplet: false   }
    ];

    var tieTable = {
        '8':        [['16', '16']],
        '4':        [['8', '8'], ['8d', '16']],
        '2':        [['4d','8']],
        '8d':       [['8','16']],
        '4d':       [['4','8']]
    };

    console.log('====================== START - BC : ' + beatCount + ' ====================');

    while(bcRemaining > 0) {
        for(i=0; i<rythmElements.length; i++) {
            if(rythmElements[i].effDur <= bcRemaining) maxIndex = i; else break;
        }
        index = Math.floor(Math.random() * (maxIndex + 0.99));

        el = rythmElements[index];

        // 'weak' entities
        if((el.tuplet !== false || el.fVex == '2' || el.fVex == '2d' )
            && Math.floor(Math.random()*2.99) == 0) continue;

        bcRemaining -= el.effDur * 4;

        if(el.tuplet !== false) {

            tupletAssocIndex[rVex.length] = el.tuplet;
            var wasTupletRest = false;

            for(var tupli = 0; tupli < el.tuplet; tupli++) {
                var tupliRest = Math.floor(Math.random()*3.99) == 0;
                if(tupliRest) {
                    rVex.push( el.fVex + 'r' );
                    rAudio.push( el.fAudio + 'r' );
                    wasTupletRest = true;
                } else {
                    rVex.push( el.fVex );
                    rAudio.push( el.fAudio );
                }
            }

            if(!wasTupletRest) {
                rVexBeams.push({
                    start:  rVex.length - el.tuplet,
                    end:    rVex.length
                });
            }

            rVexTuplets.push({ start: rVex.length - el.tuplet, end: rVex.length});

        } else {
            // pause or note?
            rand = Math.round(Math.random() * 3.99);

            if (rand == 0) { // pause

                rVex.push( el.fVex + 'r' );
                rAudio.push( el.fAudio + 'r' );

            } else { // note

                rAudio.push( el.fAudio );   // no change if we tie or not

                // split it up? (tieing)                   if possible
                if(Math.round(Math.random() * 1.99) == 0 && tieTable.hasOwnProperty(el.fVex) ) {
                    var availableTieings = tieTable[el.fVex];
                    var tieing = availableTieings[Math.floor(Math.random() * (availableTieings.length - 1 + 0.99))];
                    var toAdd = permuteArray(tieing);
                    for(var xxx = 0; xxx < toAdd.length; xxx++) rVex.push(toAdd[xxx]);
                    rVexTies.push({start: rVex.length - toAdd.length, end: (rVex.length - 1)});
                } else {
                    rVex.push( el.fVex );
                }

            }
        }

    }


    var isBeamable = function(d){
        if(d == '16' || d == '8' || d == '8d' || d == '16d') return true; else return false;
    };
    var inBeam = false;
    for(i = 0; i < rVex.length; i++) {
        var ib = (isBeamable(rVex[i]) && !tupletAssocIndex.hasOwnProperty(i));
        if(inBeam !== false) {
            if(!ib) {
                if(i - inBeam > 1) rVexBeams.push({start : inBeam, end: i});
                if(tupletAssocIndex.hasOwnProperty(i)) {
                    i += tupletAssocIndex[i];
                }
                inBeam = false;
            }
        } else {
            if(ib) {
                inBeam = i;
            } else if(tupletAssocIndex.hasOwnProperty(i)) {
                i += tupletAssocIndex[i];
            }

        }
    }
    if(inBeam !== false && i - inBeam > 1) rVexBeams.push({start : inBeam, end: i});

    console.log(rVexBeams);


    this.renderSheet = function(element) {

        var canvas = $('<canvas width="350" height="120"></canvas>');

        canvas = canvas[0];


        $(canvas).appendTo(element);

        var renderer = new Vex.Flow.Renderer(canvas, Vex.Flow.Renderer.Backends.CANVAS);

        var ctx = renderer.getContext();
        var stave = new Vex.Flow.Stave(10, 0, 330);
        stave.setContext(ctx).draw();

        var voice = new Vex.Flow.Voice({
            num_beats: beatCount,
            beat_value: 4,
            resolution: Vex.Flow.RESOLUTION
        });

        // Add notes to voice

        var tnotes = [];
        for(i in rVex) {
            var note = new Vex.Flow.StaveNote({ keys: ['b/4'], duration: rVex[i] });
            if(rVex[i].slice(-1) == 'd') note.addDotToAll();
            tnotes.push( note );
        }

        console.log(rVex);
        voice.setStrict(false);

        var beams = [];
        for(i in rVexBeams) {
            var beamDef = rVexBeams[i];
            var beam = new Vex.Flow.Beam(tnotes.slice(beamDef.start, beamDef.end));
            beams.push(beam);
        }

        /*var formatter = new Vex.Flow.Formatter().
            joinVoices([voice]).format([voice], 300);*/
        Vex.Flow.Formatter.FormatAndDraw(ctx, stave, tnotes);

        // Render voice
        //voice.draw(ctx, stave);

        // tuplets
        for(i in rVexTuplets) {
            var tupDef = rVexTuplets[i];
            var tuplet = new Vex.Flow.Tuplet(tnotes.slice(tupDef.start, tupDef.end));
            tuplet.setContext(ctx).draw();
        }

        // ties
        for(i in rVexTies) {
            var tieDef = rVexTies[i];
            var tie = new Vex.Flow.StaveTie({
                first_note: tnotes[tieDef.start],
                last_note: tnotes[tieDef.end],
                first_indices: [0],
                last_indices: [0]
            });
            tie.setContext(ctx).draw();
        }

        // beams
        for(i in beams) {
            beams[i].setContext(ctx).draw();
        }

        console.log(rVexBeams);
        console.log(rVex);
        console.log(tupletAssocIndex);

    };

    this.renderAudio = function(element) {
        $('<div></div>').addClass('audio').appendTo(element);

        var score = [];

        for(i in rAudio) {
            var isRest = rAudio[i].toString().slice(-1) == 'r';
            var duration = isRest ? parseFloat(rAudio[i].slice(0, rAudio[i].length-2)) : rAudio[i];

            score.push({
                notes: isRest ? [] : ['F5'],
                dur: duration
            });

            // add little rests between notes
            score.push({
                notes: [],
                dur:  duration * 0.1
            });
        }

        console.log(score);

        PlayNotes(score, tempo, 4);
    };

    this.render = function(type, element) {
        if(this.abstract) doRandomize();
        this.__superClass.prototype.render.apply(this, arguments);
    }

}
doInherit(BaseTask, RythmTask);

RythmTask.getAvailableRMs = function() { return [TaskRenderingMethods.AUDIO, TaskRenderingMethods.SHEET]; };
RythmTask.getRecordCount = function() { return -1; };
