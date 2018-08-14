const { server } = require('../server');
const logger = require('../logger');

server.subscription('/lobby', {
	filter: (path, msg/* , opts */) => {
		logger.info(msg);
		return true;
	},
	onSubscribe: (/* socket, path, params */) => {
		logger.info('subscribed to /lobby');
	},
	onUnsubscribe: (/* socket, path, params */) => {
		logger.info('unsubscribed from /lobby');
	},
});
