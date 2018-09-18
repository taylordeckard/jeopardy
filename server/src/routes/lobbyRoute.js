const _ = require('lodash');
const { server } = require('../server');
const Lobby = require('../classes/Lobby');
const Player = require('../classes/Player');
const logger = require('../logger');

server.route({
	method: 'GET',
	path: '/lobby/games',
	handler: () => Lobby.getGames(),
});

server.route({
	method: 'POST',
	path: '/lobby/games',
	handler: async (req) => {
		const host = new Player({
			socketId: _.get(req, 'payload.socketId'),
			username: _.get(req, 'payload.username'),
			active: true,
		});
		await Lobby.createNewGame(host, _.get(req, 'payload.year'));
		return Lobby.getGames();
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
