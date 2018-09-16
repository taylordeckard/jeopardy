const _ = require('lodash');
const Boom = require('boom');
const { server } = require('../server');
const Lobby = require('../classes/Lobby');

server.route({
	method: 'POST',
	path: '/user/register',
	handler: (req) => {
		const username = _.get(req, 'payload.username');
		if (Lobby.checkName(username)) {
			// usernames must be unique
			return Boom.badRequest('Username is already in use');
		}
		if (!username) {
			return Boom.badRequest('Missing parameters');
		}
		req.yar.set('username', username);
		return Lobby.registerPlayer(username);
	},
});

