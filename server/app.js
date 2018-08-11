const logger = require('./logger');
const { server } = require('./server');
const Nes = require('nes');


// load server routes
const loadRoutes = async () => {
	await server.register(Nes);
	require('./routes/gamesRoute'); // eslint-disable-line global-require
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
