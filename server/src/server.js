const Hapi = require('hapi');

/**
 * Class that instantiates the server
 */
class Server {
	/**
	 * Server constructor
	 */
	constructor () {
		this.server = Hapi.server({
			port: 3000,
			host: '0.0.0.0',
		});
	}
}

module.exports = new Server();
