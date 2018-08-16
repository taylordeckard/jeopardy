import Vue from 'vue';
import api from '../api';
import socket from '../socket';

export default {
  namespaced: true,
  state: {
    categories: [],
    game: null,
    questions: [],
    show: null,
    username: '',
  },
  mutations: {
    addPlayer(state, player) {
      state.game.push(player);
    },
    categories(state, categories) {
      Vue.set(state, 'categories', categories);
    },
    game(state, game) {
      Vue.set(state, 'game', game);
    },
    questions(state, questions) {
      Vue.set(state, 'questions', questions);
    },
    show(state, show) {
      Vue.set(state, 'show', show);
    },
    username(state, username) {
      Vue.set(state, 'username', username);
    },
  },
  actions: {
    async addPlayer(context, username) {
      const player = (await api.addPlayer(this.game.id, username)).body;
      context.commit('addPlayer', player);
    },
    async getGame(context, gameId) {
      const game = (await api.getGame(gameId)).body;
      context.commit('game', game);
    },
    async getQuestions(context, showNumber) {
      const show = (await api.getQuestions(showNumber)).body;
      context.commit('questions', show.questions['Jeopardy!']);
      context.commit('categories', show.categories['Jeopardy!']);
      context.commit('show', show);
    },
    async getSocket() {
      if (!socket.client.id) { // don't try to connect if already connected
        await socket.client.connect();
      }
    },
    async subscribe(/* context */) {
      await socket.client.subscribe('/game', (/* msg , flags */) => {
        // switch (msg.event) {
        // }
      });
    },
    async unsubscribe() {
      await socket.client.unsubscribe('/game', null);
    },
  },
  getters: {},
};
