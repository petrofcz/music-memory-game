/**
 * Created by petrof on 19.6.2015.
 */

var TaskRenderingMethods = {
    TEXT        :   'text',
    SHEET       :   'sheet',
    AUDIO       :   'audio'
};

var Tasks = {
    CHORD           :   'chord',
    CHORD_ABSTRACT  :   'chord_abstract',
    SCALE           :   'scale',
    SCALE_ABSTRACT  :   'scale_abstract',
    RYTHM           :   'rythm'
};

$.extend(MUSIC.scales, {
    'half diminished'           :   ['minor second','minor third','major third','tritone','fifth','major sixth','minor seventh'],
    'whole half diminished'     :   ['major second','minor third','fourth','tritone','minor sixth','major sixth','major seventh'],
    'whole tone'                :   ['major second','major third','tritone','minor sixth','minor seventh'],
    'harmonic major'            :	['major second','major third','fourth','fifth','minor sixth','major seventh'],
    'dorian'                    :   ['major second','minor third','fourth','fifth','major sixth','minor seventh'],
    'phrygian'                  :   ['minor second','minor third','fourth','fifth','minor sixth','minor seventh'],
    'lydian'                    :   ['major second','major third','augmented fourth','fifth','major sixth','major seventh'],
    'mixolydian'                :   ['major second','major third','fourth','fifth','major sixth','minor seventh'],
    'locrian'                   :   ['minor second','minor third','fourth','diminished fifth','minor sixth','minor seventh'],
    'chromatic'                 :   ['minor second','major second','minor third','major third','fourth','diminished fifth','fifth','minor sixth','major sixth','minor seventh','major seventh'],
    'altered'                   :   ['minor second','minor third','major third','diminished fifth','minor sixth','minor seventh'],
    'augmented'                 :   ['minor third','major third','fifth','minor sixth','major seventh'],
    'blues'                     :   ['minor third','fourth','tritone','fifth','minor seventh'],
    'bebop dominant'            :   ['major second','major third','fourth','fifth','major sixth','minor seventh','major seventh'],
    'bebop major'               :   ['major second','major third','fourth','fifth','minor sixth','major sixth','major seventh'],
    'gypsy major'               :   ['minor second','major third','fourth','fifth','minor sixth','major seventh'],
    'gypsy minor'               :   ['major second','minor third','tritone','fifth','minor sixth','major seventh']
});

MUSIC.chords = [];
$.extend(MUSIC.chords, {
    '7'                 :   ['1','3','5','7b'],
    'maj7'              :   ['1','3','5','7'],
    'major'             :   ['1','3','5'],
    'minor'             :   ['1','3b','5'],
    'm7'                :   ['1','3b','5','7b'],
    'm6'                :   ['1','3b','5','6'],
    'minorMaj7'         :   ['1','3b','5','7'],
    'aug'               :   ['1','3','5#'],
    'augMaj7'           :   ['1','3','5#','7'],
    'dim'               :   ['1','3b','5b'],
    'halfdim'           :   ['1','3b','5b','7b'],
    'dim7'              :   ['1','3b','5b','7bb'],
    '9'                 :   ['1','3','5','7b','9'],
    'm9'                :   ['1','3b','5','7b','9'],
    '69'                :   ['1','3','5','6','9'],
    'maj9'              :   ['1','3','5','7','9'],
    'b9'                :   ['1','3','5','7b','9b'],
    'sus4'              :   ['1','4','5'],
    'sus49'             :   ['1','4','7b','9'],
    '#9'                :   ['1','3','5','7b','9#'],
    '#9#5'              :   ['1','3','5#','7b','9#'],
    'm11'               :   ['1','3b','5','7b','9','11'],
    '7#11'              :   ['1','3','5','7b','9','11#'],
    'maj#11'            :   ['1','3','5','7','9','11#'],
    'b9#11'             :   ['1','3','5','7b','9b','11#'],
    'quartal'           :   ['1','4','7b','9#']
});

MUSIC.commonNotes = [ 'Gb', 'Db', 'Ab', 'Eb', 'Bb', 'F', 'C', 'G', 'D', 'A', 'E', 'B', 'F#', 'C#', 'G#', 'D#' ];

var DEFAULT_OCTAVE = 4;
var DEFAULT_TEMPO = 120;
