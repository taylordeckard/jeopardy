const { Pool } = require('pg');
const config = require('./config/db-config');

// create the pool as a singleton
const pool = new Pool(config);

/**
 * Class that handles db interaction
 */
class DB {
	/**
	 * DB Constructor
	 */
	constructor () {
		this.pool = pool;
	}
}

module.exports = new DB();
