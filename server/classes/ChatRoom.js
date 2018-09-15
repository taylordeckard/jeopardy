const {
	EVENTS: {
		CHAT_MESSAGE
	},
	CHAT_CONSTANTS,
} = require('../constants');
const { server } = require('../server');
const uuidv4 = require('uuid/v4');
const striptags = require('striptags');

class ChatRoom {
  constructor(options) {
    this.id = options.id;
  }

  /**
	 * Sends incoming chat message out to all players in the game
	 * @param {string} username
	 * @param {string} message
	 */
	onChatMessage (id, username, message) {
		if(message && message.length > CHAT_CONSTANTS.MAX_LENGTH) {
			logger.warn('Received a message over maximum length. Dropping it.');
			return;
		}
		// Messages get displayed as HTML so we need to strip any user-entered tags out for safety reasons.
		server.publish(`/chat/${id}`, { event: CHAT_MESSAGE, message: {text: striptags(message), username, id: uuidv4()}, id});
	}
}

module.exports = ChatRoom;
