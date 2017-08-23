/**
 * Created by petrof on 21.6.2015.
 */

/**
 * Player entity
 * @param id
 * @param name
 * @returns {Player}
 * @constructor
 */
function Player(id, name) {
    $.extend(this, {
        id          :   id,
        name        :   name,
        score       :   0
    });

    return this;
}
