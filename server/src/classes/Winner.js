const _ = require('lodash');

/**
 * A Winner
 */
class Winner {
	/**
	 * Constructs a Winner class
	 * @param {any} winner
	 */
	constructor (winner) {
		this.numGamesWon = _.get(winner, 'num_games_won');
		this.username = _.toUpper(_.get(winner, 'username'));
		this.winnings = `$${_.get(winner, 'winnings')}`;
	}
}

module.exports = Winner;

