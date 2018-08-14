const logger = require('../logger');

module.exports = {
	onMessage (/* socket, message */) {
	},
	onConnection (/* socket */) {
		logger.info('WEBSOCKET CONNECT');
	},
	onDisconnection (/* socket */) {
		logger.info('WEBSOCKET DISCONNECT');
	},
};
