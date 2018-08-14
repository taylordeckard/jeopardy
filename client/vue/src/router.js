import Vue from 'vue';
import Router from 'vue-router';
import Title from './components/Title.vue';
import Game from './components/Game.vue';
import Lobby from './components/Lobby.vue';

Vue.use(Router);

const routes = [
  { path: '/lobby', component: Lobby },
  { path: '/game', component: Game },
  { path: '/', component: Title },
];

export default new Router({
  routes,
  mode: 'history',
});
