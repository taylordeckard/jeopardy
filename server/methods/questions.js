const _ = require('lodash');
const db = require('../db');
const { ROUNDS: { JEOPARDY, DOUBLE_JEOPARDY, FINAL_JEOPARDY } } = require('../constants');

module.exports = {
	async getTotal () {
		const result = await db.pool.query('SELECT COUNT(*) FROM questions');
		return result.rows[0].count;
	},
	async getShowNumbers () {
		const result = await db.pool.query('SELECT DISTINCT(show_number) FROM questions ORDER BY show_number');
		return result.rows;
	},
	async getRandomShow () {
		const showNumbers = await this.getShowNumbers();
		return _.get(showNumbers, [_.random(0, showNumbers.length), 'show_number']);
	},
	async getQuestionsByShow (showNumber) {
		const q = 'SELECT * FROM questions WHERE show_number=$1 ORDER BY round DESC, category ASC';
		const questions = _.get(await db.pool.query(q, [showNumber]), 'rows', []);
		return this.getQuestionsPayload(questions);
	},
	getQuestionsPayload (rows) {
		const parsers = {
			[JEOPARDY]: {
				oldValues: ['$100', '$200', '$300', '$400', '$500'],
				newValues: ['$200', '$400', '$600', '$800', '$1000'],
			},
			[DOUBLE_JEOPARDY]: {
				oldValues: ['$200', '$400', '$600', '$800', '$1000'],
				newValues: ['$400', '$800', '$1200', '$1600', '$2000'],
			},
		};
		const findValueScheme = (qs, parser) => {
			const reduceFn = (memo, value) => {
				if (_.find(qs, { value })) {
					memo.matches += 1;
				}
				return memo;
			};
			const oldM = _.reduce(parser.oldValues, reduceFn, { matches: 0 });
			const newM = _.reduce(parser.newValues, reduceFn, { matches: 0 });
			if (oldM.matches > newM.matches) {
				return parser.oldValues;
			}
			return parser.newValues;
		};
		const categories = {
			[JEOPARDY]: _.uniq(_.map(_.filter(rows, { round: JEOPARDY }), 'category')),
			[DOUBLE_JEOPARDY]: _.uniq(_.map(_.filter(rows, { round: DOUBLE_JEOPARDY }), 'category')),
			[FINAL_JEOPARDY]: _.head(_.uniq(_.map(_.filter(rows, { round: FINAL_JEOPARDY }), 'category'))),
		};

		const getQuestionsFn = cats => _.reduce(cats, (qs, category) => {
			const catQs = _.filter(rows, { category });
			const parser = parsers[_.get(_.head(catQs), 'round')];
			if (parser) {
				const valueScheme = findValueScheme(catQs, parser);
				const categoryColumn = {};
				_.each(valueScheme, (value) => {
					categoryColumn[value] = _.find(catQs, { value });
					_.remove(catQs, { value });
				});
				_.each(valueScheme, (value) => {
					if (!categoryColumn[value]) {
						if (catQs.length) {
							categoryColumn[value] = _.assign(_.head(catQs), { value });
							catQs.shift();
						} else {
							categoryColumn[value] = { disabled: true, value };
						}
					}
				});
				const sortFn = q => _.parseInt(_.replace(q.value, '$', ''));
				qs.push(...(_.sortBy(_.values(categoryColumn), sortFn) || []));
			}
			return qs;
		}, []);

		const questions = {
			[JEOPARDY]: getQuestionsFn(categories[JEOPARDY]),
			[DOUBLE_JEOPARDY]: getQuestionsFn(categories[DOUBLE_JEOPARDY]),
			[FINAL_JEOPARDY]: _.find(rows, { round: FINAL_JEOPARDY }),
		};

		return { categories, questions };
	},
};
