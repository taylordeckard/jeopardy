const { server } = require('../server');
const Boom = require('boom');
const _ = require('lodash');
const qMethods = require('../methods/questions');
const logger = require('../logger');

/**
 * Gets all of the questions from a specific show
 */
server.route({
	method: 'GET',
	path: '/questions/{showNumber}',
	handler: async (req) => {
		const showNumber = _.parseInt(_.get(req, 'params.showNumber', 1));
		logger.info(`Request to /games/${showNumber}`);
		if (_.isNaN(showNumber)) {
			return Boom.notFound('The requested page cannot be found');
		}

		try {
			return qMethods.getQuestionsByShow(showNumber);
		} catch (e) {
			logger.error(e);
			return Boom.serverUnavailable('Error connecting to database');
		}
	},
});
