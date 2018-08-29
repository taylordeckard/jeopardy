import Vue from 'vue';
import { findIndex } from 'lodash-es';
import api from '../api';
import socket from '../socket';
import {
  GAME_CHANGED,
  GAME_CLOSED,
  GAME_CREATED,
  PLAYER_JOINED,
  PLAYER_LEFT,
} from '../events';

export default {
  namespaced: true,
  state: {
    games: [],
    wsClientId: '',
  },
  mutations: {
    games(state, games) {
      Vue.set(state, 'games', games);
    },
    updateGame(state, game) {
      const gameToReplaceIdx = findIndex(state.games, { id: game.id });
      if (game.players.length) {
        state.games.splice(gameToReplaceIdx, 1, game);
      } else {
        state.games.splice(gameToReplaceIdx, 1);
      }
    },
    wsClientId(state, wsClientId) {
      Vue.set(state, 'wsClientId', wsClientId);
    },
  },
  actions: {
    async createGame(context, username) {
      const games = (await api.createGame(username, context.state.wsClientId)).body;
      context.commit('games', games);
      return Promise.resolve();
    },
    async getGames(context) {
      const games = (await api.getGames()).body;
      context.commit('games', games);
    },
    async getSocket(context) {
      if (!socket.client || !socket.client.id) { // don't try to connect if already connected
        await socket.client.connect();
      }
      context.commit('wsClientId', socket.client.id);
    },
    async subscribe(context) {
      await socket.client.subscribe('/lobby', (msg/* , flags */) => {
        switch (msg.event) {
          case GAME_CLOSED:
          case GAME_CREATED:
            context.commit('games', msg.games);
            break;
          case GAME_CHANGED:
          case PLAYER_JOINED:
          case PLAYER_LEFT:
            context.commit('updateGame', msg.game);
            break;
          default:
        }
      });
    },
    async unsubscribe() {
      await socket.client.unsubscribe('/lobby', null);
    },
  },
  getters: {},
};
