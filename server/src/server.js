const Hapi = require('@hapi/hapi');

/**
 * Class that instantiates the server
 */
class Server {
	/**
	 * Server constructor
	 */
	constructor () {
		this.server = Hapi.server({
			debug: { request: ['*'] },
			port: 3000,
			host: '0.0.0.0',
		});
	}
}

module.exports = new Server();
