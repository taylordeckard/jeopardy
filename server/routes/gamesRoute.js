const _ = require('lodash');
const Boom = require('boom');
const { server } = require('../server');
const db = require('../db');
const logger = require('../logger');
const qMethods = require('../methods/questions');
const Game = require('../classes/Game');
const uuidv4 = require('uuid/v4');

const activeGames = [];

/**
 * Gets all of the questions from a specific show
 */
server.route({
	method: 'GET',
	path: '/games/{showNumber}',
	handler: async (req) => {
		const showNumber = _.parseInt(_.get(req, 'params.showNumber', 1));
		logger.info(`Request to /games/${showNumber}`);
		if (_.isNaN(showNumber)) {
			return Boom.notFound('The requested page cannot be found');
		}
		const q = 'SELECT * FROM questions WHERE show_number=$1 ORDER BY round DESC, category ASC';
		try {
			const questions = _.get(await db.pool.query(q, [showNumber]), 'rows', []);
			const payload = qMethods.getQuestionsPayload(questions);
			return payload;
		} catch (e) {
			logger.error(e);
			return Boom.serverUnavailable('Error connecting to database');
		}
	},
});

/**
 * Initializes a new game
 */
server.route({
	method: 'POST',
	path: '/games/start',
	handler: async (req) => {
		let showNumber = _.get(req, 'body.showNumber');
		if (!showNumber) {
			const showNumbers = await qMethods.getShowNumbers();
			showNumber = showNumbers[_.random(0, showNumbers.length)];
		}
		const uuid = uuidv4();
		logger.info(`New Game started -- Playing show ${showNumber}`);
		activeGames.push(new Game(uuid, showNumber));
		return { uuid, showNumber };
	},
});
