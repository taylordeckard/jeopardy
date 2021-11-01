const _ = require('lodash');
const db = require('../db');
const { ROUNDS: { JEOPARDY, DOUBLE_JEOPARDY, FINAL_JEOPARDY } } = require('../constants');

let allShowNumbers, allYears;

module.exports = {
	async getTotal () {
		const result = await db.pool.query('SELECT COUNT(*) FROM questions');
		return result.rows[0].count;
	},
	async getShowNumbers (year) {
		let result;
		if (year) {
			const q = 'SELECT DISTINCT(show_number) FROM questions WHERE year=$1 ORDER BY show_number';
			result = await db.pool.query(q, [year]);
		} else {
			if (allShowNumbers) {
				return allShowNumbers;
			}
			result = await db.pool.query('SELECT DISTINCT(show_number) FROM questions ORDER BY show_number');
			allShowNumbers = result.rows;
		}
		return result.rows;
	},
	async getYears () {
		if (allYears) {
			return allYears;
		}
		const result = await db.pool.query('SELECT DISTINCT(year) FROM questions ORDER BY year DESC');
		allYears = result.rows;
		return allYears;
	},
	async getRandomShow (year) {
		const showNumbers = await this.getShowNumbers(year);
		return _.get(showNumbers, [_.random(0, showNumbers.length), 'show_number']);
	},
	async getQuestionsByShow (showNumber, options) {
		const q = 'SELECT * FROM questions WHERE show_number=$1 ORDER BY round DESC, category ASC';
		const questions = _.get(await db.pool.query(q, [showNumber]), 'rows', []);
		return this.getQuestionsPayload(questions, options);
	},
	getQuestionsPayload (rows, options) {
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
			// filter on questions by a category
			const catQs = _.filter(rows, { category });
			// use a question value parser based on jeopardy round
			const parser = parsers[_.get(_.head(catQs), 'round')];
			if (parser) {
				// get the correct value scheme (round values changed sinced the shows inception)
				const valueScheme = findValueScheme(catQs, parser);
				const categoryColumn = {};
				_.each(valueScheme, (value) => {
					// contruct a dictionary for category's questions
					categoryColumn[value] = _.find(catQs, { value });
					_.remove(catQs, { value });
				});
				_.each(valueScheme, (value) => {
					// if a value in the scheme is not found in the dictionary,
					// add it by using remaining category questions
					if (!categoryColumn[value]) {
						if (catQs.length) {
							// this can happen if the question was a daily double
							categoryColumn[value] = _.assign(_.head(catQs), { value });
							catQs.shift();
						} else {
							// in the even there are no more category questions available,
							// the question is not in our db.. so disable it
							categoryColumn[value] = { disabled: true, value };
						}
					}
				});
				// sort (numerically) by value
				const sortFn = q => _.parseInt(_.replace(q.value, '$', ''));
				qs.push(...(_.sortBy(_.values(categoryColumn), sortFn) || []));
			}
			return qs;
		}, []);

		const qOmit = (question) => {
			if (!question) { return question; }
			// remove escape from apostrophes
			question.answer = _.replace(question.answer, /\\'/, '\'');
			// remove anything within parentheses in the answer
			question.answer = _.replace(question.answer, /\(.*\)/, '');
			// format the question
			this.formatQuestion(question);

			if (_.get(options, 'omitAnswers')) {
				return _.omit(question, 'answer');
			}
			return question;
		};

		const qOmitMap = questions => _.map(questions, qOmit);

		const questions = {
			[JEOPARDY]: qOmitMap(getQuestionsFn(categories[JEOPARDY])),
			[DOUBLE_JEOPARDY]: qOmitMap(getQuestionsFn(categories[DOUBLE_JEOPARDY])),
			[FINAL_JEOPARDY]: qOmit(_.find(rows, { round: FINAL_JEOPARDY })),
		};

		return { categories, questions };
	},

	/**
	 * Manipulates the multimedia links in the jeopardy questions
	 * @param {any} question
	 */
	formatQuestion (question) {
		let text = question.question;
		let links;
		let questionText = text;
		if (/<a href/.test(questionText)) {
			links = questionText.match(/(<a href="(.*?)">.*?<\/a>?)/g);
			links = _.map(links, (link) => {
				let l = _.replace(link, /a href/, 'a target="_blank" href');
				const itMatch = l.match(/href.*?>(.*?)<\/a>/);
				const hrefMatch = l.match(/href="(.*?)"/);
				if (itMatch) {
					let innerText = _.get(itMatch, `[${itMatch.length - 1}]`);
					// l = _.replace(l, new RegExp(innerText), _.toUpper(innerText));
					// remove the html link
					l = _.toUpper(innerText);
				}
				if (hrefMatch) {
					// attach the links to the question object
					question.links = [
						_.get(hrefMatch, `[${hrefMatch.length - 1}]`),
						...(question.links || []),
					];
				}
				return l;
			});
		}
		// capitalize the question
		questionText = _.toUpper(questionText);
		if (links) {
			_.each(links, (link) => {
				questionText = _.replace(questionText, /<A HREF.*?<\/A>/, link);
			});
		}
		question.question = _.replace(questionText, /(^'|'$)/g, '');
	},
};
