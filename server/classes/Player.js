/**
 * Player class
 */
class Player {
	/**
	 *	Player constructor
	 *	@param {any} options
	 */
	constructor (options) {
		this.nickname = options.nickname;
		this.score = 0;
	}
}

module.exports = Player;
