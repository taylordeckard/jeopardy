const { Pool } = require('pg');
const config = require('./config/db-config');
const fs = require('fs');

if (process.env.NODE_ENV === 'production') {
	config.password = fs.readFileSync('/vault/secrets/pg_password').toString();
	config.host = '10.0.1.191';
}

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
