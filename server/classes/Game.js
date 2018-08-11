const { server } = require('../server');
/**
 * Manages Game state
 */
class Game {
	/**
	 * Game constructor
	 * @param {string} uuid
	 * @param {number} showNumber
	 */
	constructor (uuid, showNumber) {
		this.showNumber = showNumber;
		this.uuid = uuid;
	}

	/**
	 * Called to start the jeopardy game
	 */
	begin () {
		this.state = 'BEGIN';
		server.publish(`/game/${this.uuid}`, { state: this.state });
	}
}

module.exports = Game;
