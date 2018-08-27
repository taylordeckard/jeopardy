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
		return {
			realAnswerTokens: _.split(_.trim(realAnswer), ' '),
			userAnswerTokens: _.split(_.trim(userAnswer), ' '),
		};
	},
	check (_realAnswer, _userAnswer) {
		const { realAnswerTokens, userAnswerTokens } = this.format(_realAnswer, _userAnswer);
		// real answer and user answer broken up into tokens
		const isCorrect = _.some(_.map(userAnswerTokens, (uToken) => {
			// compare the similarity of each user answer to each real answer
			const similarities = _.map(realAnswerTokens, rToken =>
				stringSimilarity.compareTwoStrings(rToken, uToken));
			// if any are above the similarity threshold, we have a match
			return _.some(similarities, simScore => simScore >= SIMILARITY_THRESHOLD);
		}), tokenMatch => tokenMatch);
		logger.info('REAL ANSWER: ', _realAnswer);
		logger.info('USER ANSWER: ', _userAnswer);
		return isCorrect;
	},
};
