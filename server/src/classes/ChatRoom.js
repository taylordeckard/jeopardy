const {
	EVENTS: {
		CHAT_MESSAGE
	},
	CHAT_CONSTANTS,
} = require('../constants');
const _ = require('lodash');
const { server } = require('../server');
const uuidv4 = require('uuid/v4');
const striptags = require('striptags');
const logger = require('../logger');

function publishServerMessage(id, username, message, socket) {
	server.publish(`/chat/${id}`, {
		event: CHAT_MESSAGE,
		message: {
			text: message,
			username: 'Server',
			id: uuidv4(),
			isServer: true,
		},
	}, {
		internal: {
			isServer: true,
			socketId: socket.id,
		},
	});
}

const COMMANDS = {
	':hello': function(id, username, message, socket) {
		publishServerMessage(id, username, 'Welcome! For help type ":help"', socket);
	},
	':help': function(id, username, message, socket) {
		publishServerMessage(id, username, 'For a list of dank Trebek emojis, type ":emojis"', socket);
	},
	':emojis': function(id, username, message, socket) {
		publishServerMessage(id, username, 'Prefix the following with a ":" - ' +
		_.map(CHAT_CONSTANTS.EMOJIS, value => value.replace(':', '')).join(', '), socket);
	},
}

class ChatRoom {

  constructor(options) {
    this.id = options.id;
  }

	getCommands() {
		return COMMANDS;
	}

  /**
	 * Sends incoming chat message out to all players in the game
	 * @param {string} username
	 * @param {string} message
	 */
	onChatMessage (id, username, message, socket) {
		if(message && message.length > CHAT_CONSTANTS.MAX_LENGTH) {
			logger.warn('Received a message over maximum length. Dropping it.');
			return;
		}
		// Special server commands go do their own thing
		let gotCommand = false;
		_.forOwn(COMMANDS, function(value, key) {
			if(message === key) {
				gotCommand = true;
				value(id, username, message, socket);
			}
		});
		if(gotCommand) {
			return;
		}
		// Regular messages are broadcast to everyone that's subscribed
		// Messages get displayed as HTML so we need to strip any user-entered tags out for safety reasons.
		server.publish(`/chat/${id}`, { event: CHAT_MESSAGE, message: {text: striptags(message), username, id: uuidv4(), isServer: false,}, id});
	}
}

module.exports = ChatRoom;
