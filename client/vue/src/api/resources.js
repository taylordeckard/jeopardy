import Vue from 'vue';
import VueResource from 'vue-resource';

Vue.use(VueResource);

export const GameResource = Vue.resource('/api/games/{showNumber}');
export const UserResource = Vue.resource('/api/user');
