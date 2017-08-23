/**
 * Created by petrof on 22.6.2015.
 */

/**
 * @inherits BaseTask
 * @param type string from MUSIC.chords
 * @param baseNote string from MUSIC.notes
 * @param abstract bool true if the base note should be randomized with every rendering
 * @constructor
 */
function ScaleTask(type, baseNote, abstract) {
    var _this = this;

    BaseTask.apply(this, arguments);

    baseNote = baseNote.capitalizeFirstLetter();

    if(!MUSIC.scales.hasOwnProperty(type)) throw new Error('Unknown type of chord set!');
    if(!MUSIC.notes.hasOwnProperty(baseNote)) throw new Error('Unknown base note se!');

    this.scaleType = type;
    this.baseNote = baseNote;
    this.abstract = typeof abstract == 'undefined' ? false : abstract;

    var note = Note.fromLatin(this.baseNote + DEFAULT_OCTAVE);
    var scale;
    var doScale = function() {
        scale = note.scale(_this.scaleType);
    };
    doScale();


    var doRandomize = function(){       // do the randomization
        note = Note.fromLatin(MUSIC.getRandomNote() + DEFAULT_OCTAVE);
        doScale();
    };

    this.renderText = function(element) {
        $('<div></div>').addClass('scale-text').text(this.scaleType).appendTo(element);
    };

    this.renderSheet = function(element) {

        var canvas = $('<canvas width="350" height="120"></canvas>');

        canvas = canvas[0];


        $(canvas).appendTo(element);

        var renderer = new Vex.Flow.Renderer(canvas, Vex.Flow.Renderer.Backends.CANVAS);

        var ctx = renderer.getContext();
        var stave = new Vex.Flow.Stave(10, 0, 350);

        stave.addClef("treble").setContext(ctx).draw();

        var numBeats = getObjectSize(scale);

        var voice = new Vex.Flow.Voice({
            num_beats: numBeats,
            beat_value: 1,
            resolution: Vex.Flow.RESOLUTION
        });

        // Add notes to voice

        var tnotes = [];
        for(i in scale) {
            tnotes.push(MUSIC.createNotes4Rendering([scale[i]], '1'));
        }
        voice.addTickables(tnotes);

        var formatter = new Vex.Flow.Formatter().
            joinVoices([voice]).format([voice], 300);

        // Render voice
        voice.draw(ctx, stave);
    };

    this.renderAudio = function(element) {
        $('<div></div>').addClass('audio').appendTo(element);

        var score = [];

        for(i in scale) {
            score.push({
                notes: MUSIC.normalizeNotes([scale[i]]),
                dur: 1/8
            });
        }

        console.log(score);

        PlayNotes(score, DEFAULT_TEMPO, 4);
    };

    this.render = function(type, element) {
        if(this.abstract) doRandomize();
        this.__superClass.prototype.render.apply(this, arguments);
    }

}
doInherit(BaseTask, ScaleTask);

ScaleTask.getAvailableRMs = function() { return [TaskRenderingMethods.AUDIO, TaskRenderingMethods.SHEET, TaskRenderingMethods.TEXT]; };
ScaleTask.getRecordCount = function() { return getObjectSize(MUSIC.scales) ; };
