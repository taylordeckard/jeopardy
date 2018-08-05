const logger = require('./logger');
const { server } = require('./server');

// load server routes
require('./routes/gamesRoute');

const init = async () => {
	await server.start();
	logger.info(`Server running at: ${server.info.uri}`);
};

process.on('unhandledRejection', (err) => {
	logger.error(err);
	process.exit(1);
});

init();
