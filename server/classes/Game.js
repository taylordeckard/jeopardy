const { server } = require('../server');
const uuidv4 = require('uuid/v4');

/**
 * Manages Game state
 */
class Game {
	/**
	 * Game Constructor
	 * @param {any} options
	 */
	constructor (options) {
		this.id = uuidv4();
		this.host = options.host;
		this.players = [this.host];
		this.name = options.name;
		this.showNumber = options.showNumber;
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
