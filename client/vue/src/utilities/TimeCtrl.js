import Vue from 'vue';
import { BUZZ_IN, QUESTION_PICKED } from '../events';

const SECOND = 1000;
const QUESTION_PICK_TIME_LIMIT = 10;

export default {
  [BUZZ_IN](context, game) {
    if (this.countdownInterval) {
      clearInterval(this.countdownInterval);
    }
    if (this.countdownTimer) {
      clearTimeout(this.countdownTimer);
    }
    Vue.set(game, 'timerOn', false);
    context.commit('game', game);
  },
  [QUESTION_PICKED](context, game) {
    Vue.set(game, 'timerOn', true);
    Vue.set(game, 'timer', QUESTION_PICK_TIME_LIMIT);
    context.commit('game', game);
    this.countdownInterval = setInterval(() => {
      Vue.set(game, 'timer', game.timer - 1);
      context.commit('game', game);
    }, SECOND);
    this.countdownTimer = setTimeout(() => {
      Vue.set(game, 'timerOn', false);
      context.commit('game', game);
      clearInterval(this.countdownInterval); // cancel countdoun after 10 seconds
    }, SECOND * QUESTION_PICK_TIME_LIMIT);
  },
};
