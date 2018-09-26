import Vue from 'vue';
import VueResource from 'vue-resource';
import { BASE_URL } from '../configs/config';

Vue.use(VueResource);

Vue.http.interceptors.push((request, next) => {
  next((response) => {
    if (response.status === 403) {
      window.location.href = '/';
    }
  });
});

export const QuestionsResource = Vue.resource(`${BASE_URL}/questions/{showNumber}`);
export const QuestionsYearsResource = Vue.resource(`${BASE_URL}/questions/years`);
export const GameResource = Vue.resource(`${BASE_URL}/game/{gameId}`);
export const GamePlayerResource = Vue.resource(`${BASE_URL}/game/{gameId}/player`);
export const LeaderboardResource = Vue.resource(`${BASE_URL}/leaderboard`);
export const LobbyGamesResource = Vue.resource(`${BASE_URL}/lobby/games`);
export const RegisterUsernameResource = Vue.resource(`${BASE_URL}/user/register`);
