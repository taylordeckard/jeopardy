const _ = require('lodash');
const uuidv4 = require('uuid/v4');
const Answer = require('./Answer');
const { server } = require('../server');
const {
	EVENTS: {
		ANSWER, BUZZ_IN, BUZZ_TIMEOUT, CORRECT_ANSWER, GAME_CHANGED, INCORRECT_ANSWER,
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
			const player = _.find(this.players, { username });
			this.setOnAllPlayers(['active'], false);
			_.set(player, 'active', true);
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
		if (this.state !== PRE_START && this.state !== PICK_QUESTION) {
			return;
		}
		this.state = QUESTION;
		this.started = true;
		this.currentQuestion = _.find(this.grid.questions[this.round], { id });
		this.setOnAllPlayers(['active'], false);
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
		_.set(player, 'attempted', true);
		if (isCorrect) {
			this.currentQuestion.answered = true;
			this.firstCorrectAnswer = true;
			player.score += points;
			this.state = PICK_QUESTION;
			this.setOnAllPlayers(['attempted'], false);
			this.lastPicker = player;
			const game = this.getGame();
			this.setAnswer(game, true, true, player.username);
			server.publish('/game', { event: CORRECT_ANSWER, game });
			server.publish('/lobby', { event: GAME_CHANGED, game });
			this.currentQuestion = null;
		} else {
			this.state = QUESTION;
			this.setOnAllPlayers(['active'], false);
			player.score -= points;
			if (this.buzzQueue.length) {
				logger.debug(this.buzzQueue);
				logger.debug(this.players);
				const nextInLine = _.find(this.players, { username: this.buzzQueue.unshift() });
				if (nextInLine) {
					nextInLine.active = true;
				}
			}

			let game;
			_.set(this, 'allPlayersAttempted', _.every(this.players, 'attempted'));
			if (this.allPlayersAttempted) {
				_.set(this, 'state', this.firstCorrectAnswer ? PICK_QUESTION : PRE_START);
				if (this.lastPicker) {
					this.lastPicker.active = true;
				}
				this.setOnAllPlayers(['attempted'], false);
				game = this.getGame();
				this.setAnswer(game, true, false, player.username, answer);
			} else {
				game = this.getGame();
				this.setAnswer(game, false, false, player.username, answer);
			}
			server.publish('/game', { event: INCORRECT_ANSWER, game: game });
		}
	}

	/**
	 * Handles buzzer time out event
	 * @param {string} username
	 */
	onBuzzTimeout (username) {
		this.timedOutPlayers = _.uniqBy([
			...(this.timedOutPlayers || []),
			_.find(this.players, { username }),
		], 'username');
		// if all players did not buzz in within time limit, advance the state
		if (this.timedOutPlayers.length === this.players.length) {
			_.set(this, 'state', this.firstCorrectAnswer ? PICK_QUESTION : PRE_START);
			const activePlayer = _.find(this.players, { active: true });
			if (activePlayer) {
				const pointString = _.replace(_.get(this, 'currentQuestion.value'), /^\$/, '');
				const points = _.parseInt(pointString);
				activePlayer.score -= points;
			}
			this.setOnAllPlayers(['active', 'attempted'], false);
			if (this.lastPicker) {
				this.lastPicker.active = true;
			}
			const game = this.getGame();
			this.setAnswer(game, true, false);
			server.publish('/game', { event: BUZZ_TIMEOUT, game });
			this.timedOutPlayers = [];
		}
	}

	/**
	 * Attaches the correct answer to a game reference
	 * @param {Game} game
	 * @param {boolean} includeAnswer
	 * @param {boolean} correct
	 * @param {string} username
	 * @param {string} wrongAnswer
	 */
	setAnswer (game, includeAnswer, correct, username, wrongAnswer) {
		let value;
		if (includeAnswer) {
			value = _.toUpper(_.get(this, 'currentQuestion.answer'));
		}
		_.set(game, 'answer', {
			correct,
			username,
			value,
			wrongAnswer,
		});
	}

	/**
	 * Reset all specified fields on all players to a value
	 * @param {string[]} fields
	 * @param {boolean} value
	 */
	setOnAllPlayers (fields, value) {
		_.each(this.players, (player) => {
			_.each(fields, (field) => {
				player[field] = value;
			});
		});
	}
}

module.exports = Game;
