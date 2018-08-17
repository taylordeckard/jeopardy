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
	 * Adds a new lobby game
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
	 * Removes a lobby game
	 * @param {string} gameId
	 */
	async removeGame (gameId) {
		_.remove(this.games, { id: gameId });
	}

	/**
	 * Adds a player to a game
	 * @param {string} id of game
	 * @param {Player} player
	 * @returns {Player}
	 */
	addPlayer (id, player) {
		const game = _.find(this.games, { id });
		game.players.push(player);
		server.publish('/lobby', { event: PLAYER_JOINED, game });
		server.publish('/game', { event: PLAYER_JOINED, game });
		return player;
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
	 * Removes a player from a game given a socketId reference
	 * @param {string} socketId
	 */
	removePlayerBySocket (socketId) {
		const game = _.find(this.games, g => _.find(g.players, { socketId }));
		const player = _.find(game.players, { socketId });
		this.removePlayer(game.id, player);
	}

	/**
	 * Removes a player from a game
	 * @param {string} id of game
	 * @param {Player} player
	 */
	removePlayer (id, player) {
		const game = _.find(this.games, { id });
		_.remove(game.players, { socketId: player.socketId });
		if (!game.players.length) {
			this.removeGame(game.id);
		}
		server.publish('/lobby', { event: PLAYER_LEFT, game });
		server.publish('/game', { event: PLAYER_LEFT, game });
	}
}

module.exports = new LobbyState();
