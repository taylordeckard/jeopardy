const Boom = require('boom');
const { server } = require('../server');
const Lobby = require('../classes/Lobby');

server.ext('onPreHandler', (req, h) => {
	const username = req.yar.get('username');
	if (username && Lobby.checkName(username)) {
		Lobby.renewPlayerRegistration(username);
	} else if (req.path !== '/user/register') {
		return Boom.forbidden();
	}
	return h.continue;
});
