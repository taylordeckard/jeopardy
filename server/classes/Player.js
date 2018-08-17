/**
 * Player class
 */
class Player {
	/**
	 *	Player constructor
	 *	@param {any} options
	 */
	constructor (options) {
		this.username = options.username;
		this.socketId = options.socketId;
		this.score = 0;
	}
}

module.exports = Player;
