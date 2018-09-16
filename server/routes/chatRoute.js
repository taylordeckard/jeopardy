const { server } = require('../server');
const logger = require('../logger');
const {
	EVENTS: {
		CHAT_MESSAGE
	},
	CHAT_CONSTANTS,
} = require('../constants');

server.subscription('/chat/{id}', {

	filter: async ( path, message, options ) => {
		if(options.internal) {
			if(options.internal.isServer && options.internal.socketId !== options.socket.id) {
				return false;
			}
		}
		return true;
	},
	onSubscribe: async ( socket, path, params ) => {
		logger.debug(`subscribed to /chat/${params.id}`);
	},
	onUnsubscribe: async (socket, path, params ) => {
		logger.debug(`unsubscribed from /chat/${params.id}`);
	},
});
