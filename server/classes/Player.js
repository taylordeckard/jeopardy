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
		this.score = 0;
	}
}

module.exports = Player;
