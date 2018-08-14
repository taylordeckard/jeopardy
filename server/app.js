const logger = require('./logger');
const { server } = require('./server');
const Nes = require('nes');
const socketOptions = require('./methods/socket');

// load server routes
const loadRoutes = async () => {
	await server.register({ plugin: Nes, options: socketOptions });
	/* eslint-disable global-require */
	require('./routes/lobbyRoute');
	require('./routes/gamesRoute');
	/* eslint-enable global-require */
	return Promise.resolve();
};

const init = async () => {
	await loadRoutes();
	await server.start();
	logger.info(`Server running at: ${server.info.uri}`);
};

process.on('unhandledRejection', (err) => {
	logger.error(err);
	process.exit(1);
});

init();
