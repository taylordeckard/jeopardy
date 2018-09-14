const logger = require('./logger');
const { server } = require('./server');
const Nes = require('nes');
const Yar = require('yar');
const yarOptions = require('./config/session-config');
const socketOptions = require('./methods/socket');

// load server routes
const loadRoutes = async () => {
	await server.register({ plugin: Nes, options: socketOptions });
	await server.register({ plugin: Yar, options: yarOptions });
	/* eslint-disable global-require */
	// extensions
	require('./extensions/renewUserRegistration');
	// routes
	require('./routes/leaderboardRoute');
	require('./routes/lobbyRoute');
	require('./routes/gamesRoute');
	require('./routes/questionsRoute');
	require('./routes/userRoute');
	require('./routes/chatRoute');
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
