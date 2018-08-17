module.exports = {
	EVENTS: {
		ANSWER: 'ANSWER',
		BUZZ_IN: 'BUZZ_IN',
		GAME_CHANGED: 'GAME_CHANGED',
		GAME_CREATED: 'GAME_CREATED',
		PICK_QUESTION: 'PICK_QUESTION',
		PLAYER_JOINED: 'PLAYER_JOINED',
		PLAYER_LEFT: 'PLAYER_LEFT',
		PRE_START: 'PRE_START',
		QUESTION: 'QUESTION',
		QUESTION_PICKED: 'QUESTION_PICKED',
	},
	GAME_EXPORT_FIELDS: [
		'currentQuestion', 'host', 'id', 'name', 'players', 'showNumber', 'state',
	],
	ROUNDS: {
		JEOPARDY: 'Jeopardy!',
		DOUBLE_JEOPARDY: 'Double Jeopardy!',
		FINAL_JEOPARDY: 'Final Jeopardy!',
	},
};
