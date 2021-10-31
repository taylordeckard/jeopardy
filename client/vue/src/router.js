import Vue from 'vue';
import Router from 'vue-router';
import Title from './components/Title.vue';
import Game from './components/Game.vue';
import Leaderboard from './components/Leaderboard.vue';
import Lobby from './components/Lobby.vue';

Vue.use(Router);

const routes = [
  { path: '/lobby', component: Lobby },
  { path: '/game/:id', component: Game },
  { path: '/leaderboard', component: Leaderboard },
  { path: '/', component: Title },
  { path: '*', component: Title },
];

export default new Router({
  base: '/jprdy',
  routes,
  mode: 'history',
});
