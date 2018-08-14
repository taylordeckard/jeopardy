const { server } = require('../server');
const _ = require('lodash');
const uuidv4 = require('uuid/v4');
const { EVENTS: { GAME_CREATED, PLAYER_LEFT, PLAYER_JOINED } } = require('../constants');

/**
 * LobbyGame
 */
class LobbyGame {
	/**
	 * LobbyGame Constructor
	 * @param {any} options
	 */
	constructor (options) {
		this.id = uuidv4();
		this.host = options.host;
		this.players = [];
	}
}

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
	createNewGame (host) {
		const game = new LobbyGame({ host });
		this.games.push(game);
		server.publish('/lobby', { event: GAME_CREATED, game });
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
	 * Removes a player from a game
	 * @param {string} id of game
	 * @param {Player} player
	 */
	removePlayer (id, player) {
		const game = _.find(this.games, { id });
		_.remove(game.players, { id: player.id })
		server.publish('/lobby', { event: PLAYER_LEFT, game });
	}
}

module.exports = new LobbyState();
