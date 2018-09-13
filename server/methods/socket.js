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
		CHAT_MESSAGE,
	},
} = require('../constants');
const Lobby = require('../classes/Lobby');

module.exports = {
	onMessage (socket, msg) {
		logger.debug(`MESSAGE RECIEVED: ${msg.event}`);
		const game = Lobby.getGameById(msg.gameId, { allFields: true });
		Lobby.renewPlayerRegistration(msg.username);
		switch (msg.event) {
		case ANSWER: {
			_.invoke(game, 'submitAnswer', msg.answer);
			break;
		}
		case BUZZ_IN: {
			_.invoke(game, 'buzzIn', msg.username);
			break;
		}
		case FINAL_ANSWER: {
			_.invoke(game, 'setFinalAnswer', msg.username, msg.answer);
			break;
		}
		case FINAL_ANSWER_TIME_OUT: {
			_.invoke(game, 'onFinalAnswerTimeout', msg.username);
			break;
		}
		case FINAL_BID: {
			_.invoke(game, 'setFinalBid', msg.username, msg.bid);
			break;
		}
		case FINAL_BID_TIME_OUT: {
			_.invoke(game, 'onFinalBidTimeout', msg.username);
			break;
		}
		case PICK_QUESTION: {
			_.invoke(game, 'pickQuestion', msg.questionId);
			break;
		}
		case QUESTION_BUZZ_TIME_OUT: {
			_.invoke(game, 'onBuzzTimeout', msg.username);
			break;
		}
		case CHAT_MESSAGE: {
			_.invoke(game, 'onChatMessage', msg.username, msg.message);
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
