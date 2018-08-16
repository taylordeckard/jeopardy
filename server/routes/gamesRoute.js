const Boom = require('boom');
const { server } = require('../server');
const logger = require('../logger');
const Lobby = require('../classes/Lobby');

server.route({
	method: 'GET',
	path: '/game/{id}',
	handler: (req) => {
		const notFoundMsg = Boom.notFound('Requested Game could not be found');
		if (!req.params.id) {
			return notFoundMsg;
		}
		return Lobby.getGameById(req.params.id) || notFoundMsg;
	},
});

server.subscription('/game', {
	// filter: (path, msg/* , opts */) => {
	// 	logger.info(msg);
	// 	return true;
	// },
	onSubscribe: (/* socket, path, params */) => {
		logger.debug('subscribed to /game');
	},
	onUnsubscribe: (/* socket, path, params */) => {
		logger.debug('unsubscribed from /game');
	},
});
