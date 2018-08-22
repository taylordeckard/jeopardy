const _ = require('lodash');
const logger = require('../logger');
const {
	EVENTS: {
		ANSWER,
		BUZZ_IN,
		PICK_QUESTION,
		QUESTION_BUZZ_TIME_OUT,
	},
} = require('../constants');
const Lobby = require('../classes/Lobby');

module.exports = {
	onMessage (socket, msg) {
		logger.debug(`MESSAGE RECIEVED: ${msg.event}`);
		const game = Lobby.getGameById(msg.gameId, { allFields: true });
		switch (msg.event) {
		case ANSWER: {
			_.invoke(game, 'submitAnswer', msg.answer);
			break;
		}
		case BUZZ_IN: {
			_.invoke(game, 'buzzIn', msg.username);
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
