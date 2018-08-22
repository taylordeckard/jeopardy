import Vue from 'vue';
import {
  BUZZ_IN, BUZZ_TIMEOUT, CORRECT_ANSWER, INCORRECT_ANSWER, QUESTION_BUZZ_TIME_OUT,
  QUESTION_PICKED,
} from '../events';

const SECOND = 1000;
const BUZZ_IN_TIME_LIMIT = 10;
const ANSWER_TIME_LIMIT = 10;
const SHOW_ANSWER_TIME_LIMIT = 3;

export default {
  [BUZZ_IN](context, game) {
    this.killTimers();
    this.startTimer(context, game, ANSWER_TIME_LIMIT, QUESTION_BUZZ_TIME_OUT);
  },
  [BUZZ_TIMEOUT](context, game) {
    this.showAnswer(context, game);
  },
  [QUESTION_PICKED](context, game) {
    this.startTimer(context, game, BUZZ_IN_TIME_LIMIT, QUESTION_BUZZ_TIME_OUT);
  },
  [CORRECT_ANSWER](context, game) {
    this.killTimers();
    this.showAnswer(context, game);
  },
  [INCORRECT_ANSWER](context, game) {
    this.killTimers();
    if (!game.allPlayersAttempted) {
      // show the incorrect answer
      this.showAnswer(context, game);
      setTimeout(() => {
        // allow for other players to buzz in after showing incorrect answer
        this.startTimer(context, game, BUZZ_IN_TIME_LIMIT, QUESTION_BUZZ_TIME_OUT);
      }, SECOND * SHOW_ANSWER_TIME_LIMIT);
    } else {
      this.showAnswer(context, game);
    }
  },
  killTimers() {
    if (this.countdownInterval) {
      clearInterval(this.countdownInterval);
    }
    if (this.countdownTimer) {
      clearTimeout(this.countdownTimer);
    }
  },
  showAnswer(context, game) {
    Vue.set(game, 'showAnswer', true);
    context.commit('game', game);
    this.countdownTimer = setTimeout(() => {
      Vue.set(game, 'showAnswer', false);
      context.commit('game', game);
    }, SECOND * SHOW_ANSWER_TIME_LIMIT);
  },
  startTimer(context, game, limit, dispatcher) {
    Vue.set(game, 'timerOn', true);
    Vue.set(game, 'timer', limit);
    Vue.set(game, 'timerLimit', limit);
    context.commit('game', game);
    this.countdownInterval = setInterval(() => {
      Vue.set(game, 'timer', game.timer - 0.1);
      context.commit('game', game);
    }, SECOND / 10);
    this.countdownTimer = setTimeout(() => {
      Vue.set(game, 'timerOn', false);
      context.commit('game', game);
      clearInterval(this.countdownInterval); // cancel countdown
      context.dispatch(dispatcher);
    }, SECOND * limit);
  },
};
