const _ = require('lodash');
const uuidv4 = require('uuid/v4');
const Answer = require('./Answer');
const ChatRoom = require('./ChatRoom');
const { server } = require('../server');
const leaderbard = require('../methods/leaderboard');
const {
	EVENTS: {
		ANSWER, ANSWER_TIME_OUT, BUZZ_IN, BUZZ_TIMEOUT, CORRECT_ANSWER, FINAL,
		FINAL_ANSWER_TIME_OUT, FINAL_BID_TIME_OUT, FINAL_QUESTION, GAME_CHANGED, GAME_RESULTS,
		INCORRECT_ANSWER, PICK_QUESTION, PRE_START, QUESTION, QUESTION_PICKED,
	},
	GAME_EXPORT_FIELDS,
	ROUNDS: { DOUBLE_JEOPARDY, JEOPARDY, FINAL_JEOPARDY },
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
		this.chatRoom = new ChatRoom({ id: this.id });
		this.lastPicker = this.host;
	}

	/**
	 * When going into Double Jeopardy, the lowest scoring player should have first pick
	 */
	activateLowestScorePicker () {
		this.setOnAllPlayers(['active'], false);
		const lowestScorer = _.minBy(this.players, 'score');
		_.set(lowestScorer, 'active', true);
		this.lastPicker = lowestScorer;
	}

	/**
	 * Advances game to the next round
	 */
	advanceRound () {
		switch (this.round) {
		case JEOPARDY:
			this.round = DOUBLE_JEOPARDY;
			this.activateLowestScorePicker();
			break;
		case DOUBLE_JEOPARDY:
			this.state = FINAL;
			this.round = FINAL_JEOPARDY;
			break;
		default:
		}
	}

	/**
	 * Returns whether or not all questions for this round have been answered
	 * @returns {boolean}
	 */
	areAllQuestionsAnswered () {
		const questions = this.grid.questions[this.round];
		return _.every(questions, q => q.answered || q.disabled);
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
			_.set(player, 'attempted', true);
			this.state = ANSWER;
			server.publish(`/game/${this.id}`, { event: BUZZ_IN, game: this.getGame() });
			server.publish('/lobby', { event: GAME_CHANGED, game: this.getGame() });
		} else if (!_.includes(this.buzzQueue, username)) {
			this.buzzQueue.push(username);
		}
	}

	/**
	 * Calculates the final score
	 */
	calculateFinalScore () {
		_.each(this.players, (player) => {
			player.isCorrect = Answer.check(
				this.grid.questions[FINAL_JEOPARDY].answer,
				player.finalAnswer,
				this.grid.questions[FINAL_JEOPARDY],
			);
			if (player.isCorrect) {
				player.score += _.parseInt(player.finalBid || 0);
			} else {
				player.score -= _.parseInt(player.finalBid || 0);
			}
		});
		// check for tie
		const dupScoreGroups = _.groupBy(this.players, 'score');
		const winner = _.maxBy(this.players, 'score');
		const computedTie = _.some(
			dupScoreGroups,
			sg => sg.length > 1 && _.get(sg, '[0].score') === winner.score,
		);
		if (!computedTie && winner.score > 0) {
			// update the leaderboard
			leaderbard.reportWinner(winner);
			winner.isWinner = true;
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
		server.publish(`/game/${this.id}`, { event: QUESTION_PICKED, game: this.getGame() });
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
		if (this.state !== ANSWER) {
			return;
		}
		const isCorrect = Answer.check(
			_.get(this, 'currentQuestion.answer'),
			answer,
			this.currentQuestion,
		);
		const player = _.find(this.players, { active: true });
		const points = _.parseInt(_.replace(_.get(this, 'currentQuestion.value'), /^\$/, ''));
		if (isCorrect) {
			this.currentQuestion.answered = true;
			this.firstCorrectAnswer = true;
			player.score += points;
			this.state = PICK_QUESTION;
			this.setOnAllPlayers(['attempted'], false);
			this.lastPicker = player;
			if (this.areAllQuestionsAnswered()) {
				this.advanceRound();
			}
			const game = this.getGame();
			this.setAnswer({
				game,
				includeAnswer: true,
				correct: true,
				username: player.username,
			});
			server.publish(`/game/${this.id}`, { event: CORRECT_ANSWER, game });
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
				this.onAllPlayersAttempted();
				game = this.getGame();
				this.setAnswer({
					game,
					includeAnswer: true,
					correct: false,
					username: player.username,
					wrongAnswer: answer,
				});
			} else {
				game = this.getGame();
				this.setAnswer({
					game,
					includeAnswer: false,
					correct: false,
					username: player.username,
					wrongAnswer: answer,
				});
			}
			server.publish(`/game/${this.id}`, { event: INCORRECT_ANSWER, game: game });
		}
	}

	/**
	 * Handles scenario when all players have attempted to answer a clue
	 */
	onAllPlayersAttempted () {
		this.currentQuestion.answered = true;
		_.set(this, 'state', this.firstCorrectAnswer ? PICK_QUESTION : PRE_START);
		if (this.lastPicker) {
			this.lastPicker.active = true;
		}
		this.setOnAllPlayers(['attempted'], false);
		if (this.areAllQuestionsAnswered()) {
			this.advanceRound();
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
			const activePlayer = _.find(this.players, { active: true });
			if (activePlayer) {
				const pointString = _.replace(_.get(this, 'currentQuestion.value'), /^\$/, '');
				const points = _.parseInt(pointString);
				activePlayer.score -= points;
			}
			if (this.state === ANSWER) {
				// if timed out while someone is answering, allow other players to answer
				_.set(this, 'allPlayersAttempted', _.every(this.players, 'attempted'));
				if (!this.allPlayersAttempted) {
					this.state = QUESTION;
					this.setOnAllPlayers(['active'], false);
					server.publish(`/game/${this.id}`, { event: ANSWER_TIME_OUT, game: this.getGame() });
					server.publish('/lobby', { event: GAME_CHANGED, game: this.getGame() });
					return;
				}
				this.onAllPlayersAttempted();
			}
			_.set(this, 'state', this.firstCorrectAnswer ? PICK_QUESTION : PRE_START);
			this.setOnAllPlayers(['active', 'attempted'], false);
			if (this.lastPicker) {
				this.lastPicker.active = true;
			}
			_.set(this, 'currentQuestion.answered', true);
			if (this.areAllQuestionsAnswered()) {
				this.advanceRound();
			}
			const game = this.getGame();
			this.setAnswer({ game, includeAnswer: true, correct: false });
			server.publish(`/game/${this.id}`, { event: BUZZ_TIMEOUT, game });
			this.timedOutPlayers = [];
		}
	}

	/**
	 * Attaches the correct answer to a game reference
	 * @param {any} opts
	 *   - game
	 *   - includeAnswer
	 *   - correct
	 *   - username
	 *   - wrongAnswer
	 */
	setAnswer (opts) {
		let value;
		let { correct, username, wrongAnswer } = opts;
		if (opts.includeAnswer) {
			value = _.toUpper(_.get(this, 'currentQuestion.answer'));
		}
		_.set(opts.game, 'answer', {
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

	/**
	 * Handles final jeopardy answer timeout event
	 * @param {string} username
	 */
	onFinalAnswerTimeout (username) {
		this.timedOutPlayers = _.uniqBy([
			...(this.timedOutPlayers || []),
			_.find(this.players, { username }),
		], 'username');
		// when all player's answers timout comes in, advance the state
		if (this.timedOutPlayers.length === this.players.length) {
			_.set(this, 'state', GAME_RESULTS);
			this.calculateFinalScore();
			const game = this.getGame();
			game.currentQuestion = this.grid.questions[FINAL_JEOPARDY];
			server.publish(`/game/${this.id}`, { event: FINAL_ANSWER_TIME_OUT, game });
			this.timedOutPlayers = [];
		}
	}

	/**
	 * Sets the final jeopardy  anwer
	 * @param {string} username
	 * @param {string} answer
	 */
	setFinalAnswer (username, answer) {
		const player = _.find(this.players, { username });
		_.set(player, 'finalAnswer', answer);
	}

	/**
	 * Handles bid timeout event
	 * @param {string} username
	 */
	onFinalBidTimeout (username) {
		this.timedOutPlayers = _.uniqBy([
			...(this.timedOutPlayers || []),
			_.find(this.players, { username }),
		], 'username');
		// when all player's bid timout comes in, advance the state
		if (this.timedOutPlayers.length === this.players.length) {
			_.set(this, 'state', FINAL_QUESTION);
			const game = this.getGame();
			server.publish(`/game/${this.id}`, { event: FINAL_BID_TIME_OUT, game });
			this.timedOutPlayers = [];
		}
	}

	/**
	 * Sets the final bids
	 * @param {string} username
	 * @param {number} bid
	 */
	setFinalBid (username, bid) {
		const player = _.find(this.players, { username });
		_.set(player, 'finalBid', bid);
	}

	/**
	 * Gets a player's username given a socket id
	 * @param {string} socketId
	 * @returns {string} username
	 */
	getUsernameBySocket (socketId) {
		const player = _.find(this.players, { socketId });
		return player.username;
	}
}

module.exports = Game;
