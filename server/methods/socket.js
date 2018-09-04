const _ = require('lodash');
const logger = require('../logger');
const {
	EVENTS: {
		ANSWER,
		BUZZ_IN,
		FINAL_ANSWER,
		FINAL_ANSWER_TIME_OUT,
		FINAL_BID,
		FINAL_BID_TIME_OUT,
		PICK_QUESTION,
		QUESTION_BUZZ_TIME_OUT,
	},
} = require('../constants');
const Lobby = require('../classes/Lobby');

module.exports = {
	onMessage (socket, msg) {
		logger.debug(`MESSAGE RECIEVED: ${msg.event}`);
		const game = Lobby.getGameById(msg.gameId, { allFields: true });
		Lobby.renewPlayerRegistration(game.getUsernameBySocket(socket.id));
		switch (msg.event) {
		case ANSWER: {
			_.invoke(game, 'submitAnswer', msg.answer);
			break;
		}
		case BUZZ_IN: {
			_.invoke(game, 'buzzIn', game.getUsernameBySocket(socket.id));
			break;
		}
		case FINAL_ANSWER: {
			_.invoke(game, 'setFinalAnswer', game.getUsernameBySocket(socket.id), msg.answer);
			break;
		}
		case FINAL_ANSWER_TIME_OUT: {
			_.invoke(game, 'onFinalAnswerTimeout', game.getUsernameBySocket(socket.id));
			break;
		}
		case FINAL_BID: {
			_.invoke(game, 'setFinalBid', game.getUsernameBySocket(socket.id), msg.bid);
			break;
		}
		case FINAL_BID_TIME_OUT: {
			_.invoke(game, 'onFinalBidTimeout', game.getUsernameBySocket(socket.id));
			break;
		}
		case PICK_QUESTION: {
			_.invoke(game, 'pickQuestion', msg.questionId);
			break;
		}
		case QUESTION_BUZZ_TIME_OUT: {
			_.invoke(game, 'onBuzzTimeout', game.getUsernameBySocket(socket.id));
			break;
		}
		default:
		}
	},
	onConnection (/* socket */) {
		logger.info('WEBSOCKET CONNECT');
	},
	onDisconnection (/* socket */) {
		logger.info('WEBSOCKET DISCONNECT');
	},
};
