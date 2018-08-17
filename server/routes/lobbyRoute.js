const _ = require('lodash');
const { server } = require('../server');
const Lobby = require('../classes/Lobby');
const Player = require('../classes/Player');
const logger = require('../logger');

server.route({
	method: 'GET',
	path: '/lobby/games',
	handler: () => Lobby.games,
});

server.route({
	method: 'POST',
	path: '/lobby/games',
	handler: async (req) => {
		const host = new Player({
			socketId: _.get(req, 'payload.socketId'),
			username: _.get(req, 'payload.username'),
		});
		await Lobby.createNewGame(host);
		return Lobby.games;
	},
});

server.subscription('/lobby', {
	// filter: (path, msg/* , opts */) => {
	// 	logger.info(msg);
	// 	return true;
	// },
	onSubscribe: (/* socket, path, params */) => {
		logger.debug('subscribed to /lobby');
	},
	onUnsubscribe: (/* socket, path, params */) => {
		logger.debug('unsubscribed from /lobby');
	},
});
