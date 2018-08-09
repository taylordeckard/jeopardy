import Vue from 'vue';

export default {
  namespaced: true,
  state: {
    username: '',
  },
  actions: {},
  mutations: {
    username(state, username) {
      Vue.set(state, 'username', username);
    },
  },
  getters: {},
};
