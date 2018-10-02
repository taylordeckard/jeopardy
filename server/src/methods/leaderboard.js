const _ = require('lodash');
const db = require('../db');
const logger = require('../logger');
const Winner = require('../classes/Winner');

const sortValueWhitelist = ['num_games_won', 'username', 'winnings'];
const sortDirWhitelist = ['ASC', 'DESC'];

/* QUERIES */
const upsertQuery = 'INSERT INTO winners(num_games_won, username, winnings) VALUES(1, $1, $2) ' +
	'ON CONFLICT ON CONSTRAINT winners_username_key DO UPDATE SET num_games_won = ' +
	'winners.num_games_won + 1, winnings = winners.winnings + $2';
const getQuery = (sortValue, sortDir) => {
	if (sortValue === 'num_games_won') {
		return `SELECT * FROM winners ORDER BY ${sortValue} ${sortDir}, winnings DESC LIMIT $1 OFFSET $2`;
	}
	return `SELECT * FROM winners ORDER BY ${sortValue} ${sortDir} LIMIT $1 OFFSET $2`;
};
const getCountQuery = 'SELECT COUNT(*) from winners';

module.exports = {
	/**
	 * When a game ends, this upserts a record to the winners table
	 * @param {Player} player
	 * @returns {Promise}
	 */
	reportWinner (player) {
		const username = _.toLower(player.username);
		return db.pool.query(upsertQuery, [username, player.score]);
	},

	/**
	 * Returns the list of winners
	 * @param {any} opts
	 *   - page
	 *   - limit
	 *   - sortValue
	 *   - sortDir
	 * @returns {Winner[]}
	 */
	async getLeaderboard (opts) {
		const options = _.defaults(opts, {
			page: 0,
			limit: 10,
			sortValue: 'num_games_won',
			sortDir: 'DESC',
		});
		logger.info('GET Leaderboard', options);
		let {
			page,
			limit,
			sortValue,
			sortDir,
		} = options;
		const offset = page * limit;
		sortValue = !_.includes(sortValueWhitelist, sortValue) ? 'num_games_won' : sortValue;
		sortDir = !_.includes(sortDirWhitelist, sortDir) ? 'DESC' : sortDir;
		const result = await db.pool.query(getQuery(sortValue, sortDir), [limit, offset]);
		const totalRows = _.parseInt(_.get(await db.pool.query(getCountQuery), 'rows[0].count'));
		const lastPage = Math.floor((totalRows / limit) - 1);
		return {
			isLastPage: offset + limit >= totalRows,
			lastPage,
			rows: _.map(result.rows, winner => new Winner(winner)),
			totalRows,
		};
	},
};
