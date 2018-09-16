const _ = require('lodash');
const Boom = require('boom');
const { server } = require('../server');
const Lobby = require('../classes/Lobby');

const forbiddenWhitelist = ['/leaderboard', '/user/register'];

server.ext('onPreHandler', (req, h) => {
	const username = req.yar.get('username');
	if (username && Lobby.checkName(username)) {
		Lobby.renewPlayerRegistration(username);
	} else if (!_.includes(forbiddenWhitelist, req.path)) {
		return Boom.forbidden();
	}
	return h.continue;
});
