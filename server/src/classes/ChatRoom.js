const {
	EVENTS: {
		CHAT_MESSAGE,
	},
	CHAT_CONSTANTS,
} = require('../constants');
const _ = require('lodash');
const { server } = require('../server');
const uuidv4 = require('uuid/v4');
const striptags = require('striptags');
const logger = require('../logger');

/**
 * Publishes a server message to chat
 * @param {string} id
 * @param {string} username
 * @param {string} message
 * @param {Socket} socket
 */
function publishServerMessage (id, username, message, socket) {
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
	':hello': (id, username, message, socket) => {
		publishServerMessage(id, username, 'Welcome! For help type ":help"', socket);
	},
	':help': (id, username, message, socket) => {
		publishServerMessage(id, username, 'For a list of dank Trebek emojis, type ":emojis"', socket);
	},
	':emojis': (id, username, message, socket) => {
		publishServerMessage(id, username, 'Prefix the following with a ":" - ' +
			_.map(CHAT_CONSTANTS.EMOJIS, value => value.replace(':', '')).join(', '), socket);
	},
};

/**
 * ChatRoom class
 */
class ChatRoom {
	/**
	 * Constructor for ChatRoom
	 * @param {any} options
	 *	- {string} id
	 */
	constructor (options) {
		this.id = options.id;
		this.commands = COMMANDS;
	}

	/**
	 * @returns {string[]} list of chat commands
	 */
	getCommands () {
		return this.commands;
	}

	/**
	 * Sends incoming chat message out to all players in the game
	 * @param {string} id
	 * @param {string} username
	 * @param {string} message
	 * @param {Socket} socket
	 */
	onChatMessage (id, username, message, socket) {
		if (message && message.length > CHAT_CONSTANTS.MAX_LENGTH) {
			logger.warn('Received a message over maximum length. Dropping it.');
			return;
		}
		// Special server commands go do their own thing
		let gotCommand = false;
		_.forOwn(this.commands, (value, key) => {
			if (message === key) {
				gotCommand = true;
				value(id, username, message, socket);
			}
		});
		if (gotCommand) {
			return;
		}
		// Regular messages are broadcast to everyone that's subscribed
		// Messages get displayed as HTML so we need to strip any user-entered
		// tags out for safety reasons.
		server.publish(`/chat/${id}`, {
			id,
			event: CHAT_MESSAGE,
			message: {
				text: striptags(message),
				username,
				id: uuidv4(),
				isServer: false,
			},
		});
	}
}

module.exports = ChatRoom;
