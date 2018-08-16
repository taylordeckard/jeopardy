const { server } = require('../server');
const _ = require('lodash');
const Game = require('./Game');
const qMethods = require('../methods/questions');
const { EVENTS: { GAME_CREATED, PLAYER_LEFT, PLAYER_JOINED } } = require('../constants');

/**
 * Stores state of all current games
 */
class LobbyState {
	/**
	 * LobbyState constructor
	 */
	constructor () {
		this.games = [];
	}

	/**
	 * Adds a new lobby state
	 * @param {string} host
	 */
	async createNewGame (host) {
		const game = new Game({
			host,
			name: `Game ${this.games.length + 1}`,
			showNumber: await qMethods.getRandomShow(),
		});
		this.games.push(game);
		server.publish('/lobby', { event: GAME_CREATED, games: this.games });
	}

	/**
	 * Adds a player to a game
	 * @param {string} id of game
	 * @param {Player} player
	 */
	addPlayer (id, player) {
		const game = _.find(this.games, { id });
		game.players.push(player);
		server.publish('/lobby', { event: PLAYER_JOINED, game });
	}

	/**
	 * Gets a game by id
	 * @param {string} id
	 * @returns {Game}
	 */
	getGameById (id) {
		return _.find(this.games, { id });
	}

	/**
	 * Removes a player from a game
	 * @param {string} id of game
	 * @param {Player} player
	 */
	removePlayer (id, player) {
		const game = _.find(this.games, { id });
		_.remove(game.players, { id: player.id });
		server.publish('/lobby', { event: PLAYER_LEFT, game });
	}
}

module.exports = new LobbyState();
