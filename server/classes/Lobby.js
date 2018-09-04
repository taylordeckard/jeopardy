const { server } = require('../server');
const _ = require('lodash');
const Game = require('./Game');
const qMethods = require('../methods/questions');
const {
	EVENTS: {
		GAME_CLOSED,
		GAME_CREATED,
		PLAYER_LEFT,
		PLAYER_JOINED,
	},
	REGISTRATION_EXPIRATION,
} = require('../constants');

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
		const showNumber = await qMethods.getRandomShow();
		const grid = await qMethods.getQuestionsByShow(showNumber);
		const name = `Game ${this.games.length + 1}`;
		const game = new Game({
			grid,
			host,
			name,
			showNumber,
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
	 * Registers a player to the lobby
	 * @param {string} username
	 * @returns {string}
	 */
	registerPlayer (username) {
		const regUser = { username };
		// store usernames for all active sessions
		this.registeredUsernames = _.uniqBy(
			[...(this.registeredUsernames || []), regUser],
			'username',
		);
		regUser.expiry = setTimeout(() => {
			_.remove(this.registeredUsernames, { username });
		}, REGISTRATION_EXPIRATION);
		return username;
	}

	/**
	 * Renews a players registration
	 * @param {string} username
	 */
	renewPlayerRegistration (username) {
		const regUser = _.find(this.registeredUsernames, { username });
		if (regUser) {
			// cancel the previous expiration
			clearTimeout(regUser.expiry);
			// reset the expiration
			regUser.expiry = setTimeout(() => {
				_.remove(this.registeredUsernames, { username });
			}, REGISTRATION_EXPIRATION);
		}
	}

	/**
	 * Gets a game by id
	 * @param {string} id
	 * @param {any} options
	 * @returns {Game}
	 */
	getGameById (id, options) {
		const game = _.find(this.games, { id });
		if (_.get(options, 'allFields')) {
			return game;
		}
		return _.invoke(game, 'getGame');
	}

	/**
	 * Gets this lobby's list of games
	 * @returns {Game[]}
	 */
	getGames () {
		return _.map(this.games, game => game.getGame());
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
		_.remove(this.registeredUsernames, { username: player.username });
		if (!game.players.length) {
			this.removeGame(game.id);
		}
		if (game.players.length) {
			server.publish('/lobby', { event: PLAYER_LEFT, game });
			server.publish('/game', { event: PLAYER_LEFT, game });
		} else {
			server.publish('/lobby', { event: GAME_CLOSED, games: this.getGames() });
		}
	}

	/**
	 * Checks if a username is already taken
	 * @param {string} username
	 * @returns {boolean}
	 */
	checkName (username) {
		return _.includes(_.map(this.registeredUsernames, 'username'), username);
	}
}

module.exports = new LobbyState();
