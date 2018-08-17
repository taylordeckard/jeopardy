const { server } = require('../server');
const _ = require('lodash');
const uuidv4 = require('uuid/v4');
const {
	EVENTS: {
		ANSWER, BUZZ_IN, GAME_CHANGED, PRE_START, QUESTION, QUESTION_PICKED,
	},
	GAME_EXPORT_FIELDS,
	ROUNDS: { JEOPARDY },
} = require('../constants');

/**
 * Manages Game state
 */
class Game {
	/**
	 * Game Constructor
	 * @param {any} options
	 */
	constructor (options) {
		this.buzzQueue = [];
		this.grid = options.grid;
		this.host = options.host;
		this.id = uuidv4();
		this.name = options.name;
		this.players = [this.host];
		this.round = JEOPARDY;
		this.showNumber = options.showNumber;
		this.state = PRE_START;
	}

	/**
	 * Changes state when a user buzzes in to answer a question
	 * @param {string} username
	 */
	buzzIn (username) {
		if (this.state !== ANSWER) {
			_.set(_.find(this.players, { username }), 'active', true);
			this.state = ANSWER;
			server.publish('/game', { event: BUZZ_IN, game: this.getGame() });
			server.publish('/lobby', { event: GAME_CHANGED, game: this.getGame() });
		} else if (!_.includes(this.buzzQueue, username)) {
			this.buzzQueue.push(username);
		}
	}

	/**
	 * Changes game state when a user picks a question
	 * @param {string} id
	 */
	pickQuestion (id) {
		this.state = QUESTION;
		this.currentQuestion = _.omit(_.find(this.grid.questions[this.round], { id }), 'answer');
		server.publish('/game', { event: QUESTION_PICKED, game: this.getGame() });
		server.publish('/lobby', { event: GAME_CHANGED, game: this.getGame() });
	}

	/**
	 * Game getter
	 * @returns {Game}
	 */
	getGame () {
		return _.pick(this, GAME_EXPORT_FIELDS);
	}
}

module.exports = Game;
