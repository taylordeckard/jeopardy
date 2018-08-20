const _ = require('lodash');
const uuidv4 = require('uuid/v4');
const Answer = require('./Answer');
const { server } = require('../server');
const {
	EVENTS: {
		ANSWER, BUZZ_IN, CORRECT_ANSWER, GAME_CHANGED, INCORRECT_ANSWER,
		PICK_QUESTION, PRE_START, QUESTION, QUESTION_PICKED,
	},
	GAME_EXPORT_FIELDS,
	ROUNDS: { JEOPARDY },
} = require('../constants');
const logger = require('../logger');

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
		this.currentQuestion = _.find(this.grid.questions[this.round], { id });
		server.publish('/game', { event: QUESTION_PICKED, game: this.getGame() });
		server.publish('/lobby', { event: GAME_CHANGED, game: this.getGame() });
	}

	/**
	 * Game getter
	 * @returns {Game}
	 */
	getGame () {
		const game = _.pick(this, GAME_EXPORT_FIELDS);
		game.currentQuestion = _.omit(game.currentQuestion, 'answer');
		return game;
	}

	/**
	 * Changes state when a user submits an answer
	 * @param {string} answer
	 */
	submitAnswer (answer) {
		const isCorrect = Answer.check(_.get(this, 'currentQuestion.answer'), answer);
		const player = _.find(this.players, { active: true });
		const points = _.parseInt(_.replace(_.get(this, 'currentQuestion.value'), /^\$/, ''));
		if (isCorrect) {
			this.currentQuestion.answered = true;
			this.currentQuestion = null;
			player.score += points;
			this.state = PICK_QUESTION;
			_.each(this.players, (p) => {
				// remove active from all players
				p.active = false;
			});
			server.publish('/game', { event: CORRECT_ANSWER, game: this.getGame() });
			server.publish('/lobby', { event: GAME_CHANGED, game: this.getGame() });
		} else {
			this.state = QUESTION;
			_.each(this.players, (p) => {
				// remove active from all players
				p.active = false;
			});
			player.score -= points;
			if (this.buzzQueue.length) {
				logger.debug(this.buzzQueue);
				logger.debug(this.players);
				const nextInLine = _.find(this.players, { username: this.buzzQueue.unshift() });
				if (nextInLine) {
					nextInLine.active = true;
				}
			}
			server.publish('/game', { event: INCORRECT_ANSWER, game: this.getGame() });
		}
	}
}

module.exports = Game;
