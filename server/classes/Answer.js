const _ = require('lodash');
const stringSimilarity = require('string-similarity');
const { REGEX: { ARTICLES, BAD_CHARS }, SIMILARITY_THRESHOLD } = require('../constants');
const logger = require('../logger');

module.exports = {
	format (_realAnswer, _userAnswer) {
		let realAnswer = _.replace(_.toLower(_realAnswer), BAD_CHARS, ''),
			userAnswer = _.replace(_.toLower(_userAnswer), BAD_CHARS, '');
		realAnswer = _.replace(realAnswer, ARTICLES, ' ');
		userAnswer = _.replace(userAnswer, ARTICLES, ' ');
		return { realAnswer: _.trim(realAnswer), userAnswer: _.trim(userAnswer) };
	},
	check (_realAnswer, _userAnswer) {
		const { realAnswer, userAnswer } = this.format(_realAnswer, _userAnswer);
		const similarity = stringSimilarity.compareTwoStrings(realAnswer, userAnswer);
		logger.info('REAL ANSWER: ', realAnswer);
		logger.info('USER ANSWER: ', userAnswer);
		logger.info('SIMILARITY: ', similarity);
		if (realAnswer !== userAnswer && similarity < SIMILARITY_THRESHOLD) {
			return false;
		}

		return true;
	},
};
