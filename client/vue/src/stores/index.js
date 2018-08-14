import Vue from 'vue';
import Vuex from 'vuex';
import GameStore from './GameStore';
import LobbyStore from './LobbyStore';

Vue.use(Vuex);

export default new Vuex.Store({
  modules: {
    game: GameStore,
    lobby: LobbyStore,
  },
});
