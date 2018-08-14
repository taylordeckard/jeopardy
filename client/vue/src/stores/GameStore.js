import Vue from 'vue';
import api from '../api';

export default {
  namespaced: true,
  state: {
    categories: [],
    game: null,
    questions: [],
    username: '',
  },
  mutations: {
    categories(state, categories) {
      Vue.set(state, 'categories', categories);
    },
    game(state, game) {
      Vue.set(state, 'game', game);
    },
    questions(state, questions) {
      Vue.set(state, 'questions', questions);
    },
    username(state, username) {
      Vue.set(state, 'username', username);
    },
  },
  actions: {
    async getQuestions(context) {
      const game = (await api.getQuestions(6298)).body; // last game
      // const game = (await api.getQuestions(1)).body; // first game
      context.commit('questions', game.questions['Jeopardy!']);
      context.commit('categories', game.categories['Jeopardy!']);
      context.commit('game', game);
    },
  },
  getters: {},
};
