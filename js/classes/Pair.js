/**
 * Pair class representing the pair of cards
 * @param pos1 int id of the first card
 * @param pos2 int id of the second card
 * @param task BaseTask task represented by this pair
 * @constructor
 */
function Pair(pos1, pos2, task){

    this.pos1 = pos1;
    this.pos2 = pos2;

    this.task = task;
    this.ownerId = -1;

}
