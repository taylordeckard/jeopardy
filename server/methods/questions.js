const db = require('../db');

module.exports = {
	async getTotal () {
		const result = await db.pool.query('SELECT COUNT(*) FROM questions');
		return result.rows[0].count;
	},
};
