import Vue from 'vue';
import VueResource from 'vue-resource';

Vue.use(VueResource);

Vue.http.interceptors.push((request, next) => {
  next((response) => {
    if (response.status === 403) {
      window.location.href = '/';
    }
  });
});

export const QuestionsResource = Vue.resource('/api/questions/{showNumber}');
export const QuestionsYearsResource = Vue.resource('/api/questions/years');
export const GameResource = Vue.resource('/api/game/{gameId}');
export const GamePlayerResource = Vue.resource('/api/game/{gameId}/player');
export const LobbyGamesResource = Vue.resource('/api/lobby/games');
export const RegisterUsernameResource = Vue.resource('/api/user/register');
