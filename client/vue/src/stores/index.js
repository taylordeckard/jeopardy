import Vue from 'vue';
import Vuex from 'vuex';
import GameStore from './GameStore';

Vue.use(Vuex);

export default new Vuex.Store({
  modules: {
    game: GameStore,
  },
});
