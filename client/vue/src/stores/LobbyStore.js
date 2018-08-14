import Vue from 'vue';
import { find, remove } from 'lodash-es';
import socket from '../socket';
import {
  GAME_CREATED,
  PLAYER_JOINED,
  PLAYER_LEFT,
} from '../events';

export default {
  namespaced: true,
  state: {
    games: [],
  },
  mutations: {
    games(state, games) {
      Vue.set(state, 'games', games);
    },
    addGame(state, game) {
      state.games.push(game);
    },
    addPlayer(state, game, player) {
      const g = find(state.games, { id: game.id });
      g.players.push(player);
    },
    removePlayer(state, game, player) {
      const g = find(state.games, { id: game.id });
      remove(g.players, { id: player.id });
    },
  },
  actions: {
    async getGames(/* context */) {
      // const games = (await api.getGames()).body;
      // context.commit('games', games);
    },
    async getSocket() {
      if (!socket.client.id) { // don't try to connect if already connected
        await socket.client.connect();
      }
    },
    async subscribe(context) {
      await socket.client.subscribe('/lobby', (msg/* , flags */) => {
        switch (msg) {
          case GAME_CREATED:
            context.commit('addGame', msg.game);
            break;
          case PLAYER_JOINED:
            context.commit('addPlayer', msg.game, msg.player);
            break;
          case PLAYER_LEFT:
            context.commit('removePlayer', msg.game, msg.player);
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
