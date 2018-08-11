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
		const q = 'SELECT * FROM questions WHERE show_number=$1';
		try {
			const result = await db.pool.query(q, [showNumber]);
			return result;
		} catch (e) {
			logger.error(e);
			return Boom.badImplementation('This shouldn\'t happen');
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
		const showNumber = _.get(req, 'body.showNumber', _.random(1, await qMethods.getTotal()));
		const uuid = uuidv4();
		logger.info(`New Game started -- Playing show ${showNumber}`);
		activeGames.push(new Game(uuid, showNumber));
		return uuid;
	},
});

server.subscription('/game/{uuid}', {
// 	filter: (path, msg, opts) => {
// 		return true;
// 	},
// 	onSubscribe: (socket, path, params) => {
// 	},
// 	onUnsubscribe: (socket, path, params) => {
// 	},
});
