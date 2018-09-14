const _ = require('lodash');
const { server } = require('../server');
const leaderboard = require('../methods/leaderboard');

server.route({
	method: 'GET',
	path: '/leaderboard',
	handler: req => leaderboard.getLeaderboard(_.pick(req.query, [
		'page', 'limit', 'sortValue', 'sortDir',
	])),
});
