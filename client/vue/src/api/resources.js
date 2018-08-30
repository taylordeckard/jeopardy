import Vue from 'vue';
import VueResource from 'vue-resource';

Vue.use(VueResource);

export const QuestionsResource = Vue.resource('/api/questions/{showNumber}');
export const GameResource = Vue.resource('/api/game/{gameId}');
export const GamePlayerResource = Vue.resource('/api/game/{gameId}/player');
export const LobbyGamesResource = Vue.resource('/api/lobby/games');
export const CheckNameResource = Vue.resource('/api/lobby/usernameTaken');
