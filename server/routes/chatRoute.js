const { server } = require('../server');
const logger = require('../logger');

server.subscription('/chat/{id}', {

	onSubscribe: ( socket, path, params ) => {
		logger.debug(`subscribed to /chat/${params.id}`);
	},
	onUnsubscribe: (socket, path, params ) => {
		logger.debug(`unsubscribed from /chat/${params.id}`);
	},
});
