const _ = require('lodash');
const Boom = require('boom');
const { server } = require('../server');
const db = require('../db');
const logger = require('../logger');

server.route({
	method: 'GET',
	path: '/games/{showNumber}',
	handler: async (req) => {
		const showNumber = _.parseInt(_.get(req, 'params.showNumber', 1));
		logger.info(`Request to /games/${showNumber}`);
		if (_.isNaN(showNumber)) {
			return Boom.notFound('The requested page cannot be found');
		}
		const q = `SELECT * FROM questions WHERE show_number=${showNumber}`;
		const result = await db.pool.query(q);
		return result;
	},
});
