/**
 * Created by petrof on 20.6.2015.
 */

/**
 * Game constructor
 * @param playerNames array of player names
 * @param size size of the game board - # of cards (not # of pairs)
 * @param gameType string game type (Tasks.*)
 * @param renderingMethods string[] rendering methods (TaskRenderingMethods.*)
 * @constructor
 */
function Game(playerNames, size, gameType, renderingMethods) {

    this.cbPlayerChange = $.Callbacks(); // function(oldPlayerId, newPlayerId) { };
    this.cbHideCards = $.Callbacks();    // function(pos1, pos2, cbFinished) { }; !!! finished callback must be called when finished
    this.cbRoundChange = $.Callbacks(); // function(roundNumber) { };
    this.cbPairGained = $.Callbacks(); // function(pos1, pos2, playerId) { };
    this.cbGameOver = $.Callbacks(); // function() { };

    if(!playerNames || !playerNames.length) throw new Error('No players set!');
    if(size % 2 != 0) throw new Error('Only even game board sizes are supported!');

    /** @type Player[] */
    this.players = [];

    this.currentPlayerId = 0;
    this.cardCount = size;
    this.pairCount = size/2;

    /** @type Pair[] */
    this.pairs = [];

    var pos2pairId = [];
    var clickLocked = false;
    var firstPos = -1;          // first card turned by player
    var round = 1;
    var totalHits = 0;

    // init players
    for(i in playerNames) {
        this.players[i] = new Player(i, playerNames[i]);
    }

    // init tasks
    var tasks = [];
    switch(gameType) {
        case Tasks.CHORD:
        case Tasks.CHORD_ABSTRACT:
            var chords = MUSIC.chords;
            var permutedChords = permuteArray(getObjectKeys(chords));
            for(a = 0; a < this.pairCount; a++) {
                tasks[a] = new ChordTask(permutedChords[a], MUSIC.getRandomNote(), gameType == Tasks.CHORD_ABSTRACT);
            }
            break;

        case Tasks.SCALE:
        case Tasks.SCALE_ABSTRACT:
            var scales = MUSIC.scales;
            var permutedScales = permuteArray(getObjectKeys(scales));
            for(a = 0; a < this.pairCount; a++) {
                tasks[a] = new ScaleTask(permutedScales[a], MUSIC.getRandomNote(), gameType == Tasks.SCALE_ABSTRACT);
            }
            break;

        case Tasks.RYTHM:
            for(a = 0; a < this.pairCount; a++) {
                tasks[a] = new RythmTask(100 + Math.floor(Math.random() * 100));
            }
            break;

        default:
            throw new Error('Unsupported game type!');
    }

    // initialize pairs
    var cardPerm = [];
    for(i=0; i < this.cardCount; i++) cardPerm[i] = i;

    cardPerm = permuteArray(cardPerm);

    for(i=0; i < this.pairCount; i++) {
        this.pairs.push(new Pair(
            cardPerm[i*2], cardPerm[i*2+1], tasks[i]
        ));
        pos2pairId[cardPerm[i*2]] = i;
        pos2pairId[cardPerm[i*2+1]] = i;
    }

    this.isClickLocked = function(){ return clickLocked; };
    var setClickLocked = function(l){ clickLocked = l; };

    /**
     * This method handles user click
     * @param pos id of the card
     * @param element to be the task rendered in
     */
    this.handleClick = function (pos, element) {
        if(this.isClickLocked()) return false;      // something in progress
        if(pos == firstPos) return false;           // cannot turn over 1 single card 2 times

        if(this.pairs[pos2pairId[pos]].ownerId != -1) return false;     // this card belongs to pair that is gained by somebody already

        var isHit = false;
        var rmIndex = 0; // rendering method index -  is the first card of the pair
        if(this.pairs[pos2pairId[pos]].pos1 != pos) rmIndex = 1;   // is the second card of the pair

        $(element).empty();

        this.pairs[pos2pairId[pos]].task.render(renderingMethods[rmIndex], element);

        if(firstPos != -1 && pos2pairId[firstPos] == pos2pairId[pos]) {     // the player gains that pair
            this.pairs[pos2pairId[firstPos]].ownerId = this.currentPlayerId;
            this.players[this.currentPlayerId].score++;
            totalHits++;
            this.cbPairGained.fire(firstPos, pos, this.currentPlayerId);
            isHit = true;
        }

        if(firstPos == -1) {
            firstPos = pos;
        } else {
            var $this = this;

            setClickLocked(true);

            this.cbHideCards.fire(firstPos, pos, function() {
                firstPos = -1;
                var tttmp = $this.currentPlayerId;

                if(!isHit)
                    $this.currentPlayerId = ($this.currentPlayerId + 1) % $this.players.length;

                $this.cbPlayerChange.fire(tttmp, $this.currentPlayerId);

                setClickLocked(false);

                if($this.pairCount == totalHits) {
                    $this.cbGameOver.fire();
                }

                if (tttmp == 0) {
                    round++;
                    $this.cbRoundChange.fire(round);
                }
            });
        }

        return true;
    };

}




