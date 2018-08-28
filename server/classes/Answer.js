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
			realAnswer: _.trim(realAnswer),
			userAnswer: _.trim(userAnswer),
		};
	},
	check (_realAnswer, _userAnswer, card) {
		const { realAnswer, userAnswer } = this.format(_realAnswer, _userAnswer);
		const exactMatchSimilarity = stringSimilarity.compareTwoStrings(realAnswer, userAnswer);
		logger.debug('SIMILARITY: ', exactMatchSimilarity);
		if (exactMatchSimilarity >= SIMILARITY_THRESHOLD) {
			// if it's an exact match return true
			return true;
		}
		const realAnswerTokens = _.split(realAnswer, ' ');
		const userAnswerTokens = _.split(userAnswer, ' ');
		// real answer and user answer broken up into tokens
		const isCorrect = _.some(_.map(userAnswerTokens, (uToken) => {
			// compare the similarity of each user answer to each real answer
			if (
				// to reduce false positives, only compare tokens greater than length 3
				uToken.length > 3
				// not included in the question
				&& !_.includes(card.question, uToken)
				// or the category
				&& !_.includes(card.category, uToken)
			) {
				const similarities = _.map(realAnswerTokens, rToken =>
					stringSimilarity.compareTwoStrings(rToken, uToken));
				return _.some(similarities, simScore => simScore >= SIMILARITY_THRESHOLD);
			}

			return false;
		}), tokenMatch => tokenMatch);
		logger.debug('REAL ANSWER: ', realAnswer);
		logger.debug('USER ANSWER: ', userAnswer);
		return isCorrect;
	},
};
