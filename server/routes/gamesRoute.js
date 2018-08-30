const _ = require('lodash');
const Boom = require('boom');
const { server } = require('../server');
const logger = require('../logger');
const Lobby = require('../classes/Lobby');
const Player = require('../classes/Player');

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

server.route({
	method: 'POST',
	path: '/game/{id}/player',
	handler: (req) => {
		const socketId = _.get(req, 'payload.socketId');
		const player = new Player({ username: _.get(req, 'payload.player'), socketId });
		if (Lobby.checkName(player)) {
			// usernames must be unique
			return Boom.badRequest('Username is already in use');
		}
		if (!req.params.id || !player || !socketId) {
			return Boom.badRequest('Missing parameters');
		}
		return Lobby.addPlayer(req.params.id, player);
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
	onUnsubscribe: (socket/* , path, params */) => {
		logger.debug('unsubscribed from /game');
		Lobby.removePlayerBySocket(socket.id);
	},
});
