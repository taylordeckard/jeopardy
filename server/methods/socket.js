const _ = require('lodash');
const logger = require('../logger');
const { EVENTS: { BUZZ_IN, PICK_QUESTION } } = require('../constants');
const Lobby = require('../classes/Lobby');

module.exports = {
	onMessage (socket, msg) {
		logger.debug(`MESSAGE RECIEVED: ${msg.event}`);
		switch (msg.event) {
		case PICK_QUESTION: {
			const game = Lobby.getGameById(msg.gameId, { allFields: true });
			_.invoke(game, 'pickQuestion', msg.questionId);
			break;
		}
		case BUZZ_IN: {
			const game = Lobby.getGameById(msg.gameId, { allFields: true });
			_.invoke(game, 'buzzIn', msg.username);
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
