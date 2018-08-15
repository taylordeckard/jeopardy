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
	handler: (req) => {
		const host = new Player({ username: _.get(req, 'payload.username') });
		Lobby.createNewGame(host);
		server.publish('/lobby', Lobby.games);
		return Lobby.games;
	},
});

server.subscription('/lobby', {
	// filter: (path, msg/* , opts */) => {
	// 	logger.info(msg);
	// 	return true;
	// },
	onSubscribe: (/* socket, path, params */) => {
		logger.info('subscribed to /lobby');
	},
	onUnsubscribe: (/* socket, path, params */) => {
		logger.info('unsubscribed from /lobby');
	},
});
