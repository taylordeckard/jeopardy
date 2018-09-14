const {
	EVENTS: {
		CHAT_MESSAGE
	},
	CHAT_CONSTANTS,
} = require('../constants');
const { server } = require('../server');

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
		server.publish(`/chat/${id}`, { event: CHAT_MESSAGE, message: {text: message, username}, id});
	}
}

module.exports = ChatRoom;
