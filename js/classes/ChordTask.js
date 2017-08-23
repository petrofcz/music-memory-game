/**
 * @inherits BaseTask
 * @param type string from MUSIC.chords
 * @param baseNote string from MUSIC.notes
 * @param abstract bool true if the base note should be randomized with every rendering
 * @constructor
 */
function ChordTask(type, baseNote, abstract) {
    var _this = this;

    BaseTask.apply(this, arguments);

    baseNote = baseNote.capitalizeFirstLetter();

    if(!MUSIC.chords.hasOwnProperty(type)) throw new Error('Unknown type of chord set!');
    if(!MUSIC.notes.hasOwnProperty(baseNote)) throw new Error('Unknown base note se!');

    this.chordType = type;
    this.baseNote = baseNote;
    this.abstract = typeof abstract == 'undefined' ? false : abstract;

    var note = Note.fromLatin(this.baseNote + DEFAULT_OCTAVE);
    var chord;
    var doChord = function() {
        chord = note.chord(_this.chordType);
    };
    doChord();


    var doRandomize = function(){       // do the randomization
        note = Note.fromLatin(MUSIC.getRandomNote() + DEFAULT_OCTAVE);
        doChord();
    };


    this.renderText = function(element) {
        $('<div></div>').addClass('chord-text').text(this.chordType).appendTo(element);
    };

    this.renderSheet = function(element) {
        w = element.width()*1.1;
        h = element.height()*1.1;
        console.log(w);

        var canvas = $('<canvas width="120" height="120"></canvas>');

        canvas = canvas[0];


        $(canvas).appendTo(element);

        var renderer = new Vex.Flow.Renderer(canvas, Vex.Flow.Renderer.Backends.CANVAS);

        var ctx = renderer.getContext();
        var stave = new Vex.Flow.Stave(10, 6, 100);
        stave.addClef("treble").setContext(ctx).draw();

        var voice = new Vex.Flow.Voice({
            num_beats: 4,
            beat_value: 4,
            resolution: Vex.Flow.RESOLUTION
        });

        // Add notes to voice

        voice.addTickables([
            MUSIC.createNotes4Rendering(chord, '1')
        ]);

        var formatter = new Vex.Flow.Formatter().
            joinVoices([voice]).format([voice], 500);

        // Render voice
        voice.draw(ctx, stave);
    };

    this.renderAudio = function(element) {
        $('<div></div>').addClass('audio').appendTo(element);

        var score = [{
            notes: MUSIC.normalizeNotes(chord),
            dur:   1
        }];
        console.log(score);
        PlayNotes(score, DEFAULT_TEMPO, 4);
    };

    this.render = function(type, element) {
        if(this.abstract) doRandomize();
        this.__superClass.prototype.render.apply(this, arguments);
    }

}
doInherit(BaseTask, ChordTask);

ChordTask.getAvailableRMs = function() { return [TaskRenderingMethods.AUDIO, TaskRenderingMethods.SHEET, TaskRenderingMethods.TEXT]; };
ChordTask.getRecordCount = function() { return getObjectSize(MUSIC.chords) ; };
