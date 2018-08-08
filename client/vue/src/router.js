import Vue from 'vue';
import Router from 'vue-router';
import Title from './components/Title.vue';
import Game from './components/Game.vue';

Vue.use(Router);

const routes = [
  { path: '/game', component: Game },
  { path: '/', component: Title },
];

export default new Router({
  routes,
  mode: 'history',
});
