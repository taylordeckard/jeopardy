import Vue from 'vue';
import {
  BUZZ_IN, BUZZ_TIMEOUT, CORRECT_ANSWER, FINAL, FINAL_ANSWER, FINAL_ANSWER_TIME_OUT,
  FINAL_BID_TIME_OUT, INCORRECT_ANSWER, QUESTION_BUZZ_TIME_OUT, QUESTION_PICKED,
} from '../events';

const SECOND = 1000;
const BID_TIME_LIMIT = 10;
const BUZZ_IN_TIME_LIMIT = 10;
const ANSWER_TIME_LIMIT = 10;
const SHOW_ANSWER_TIME_LIMIT = 3;
const SHOW_ROUND_TITLE_TIME_LIMIT = 4;
const FINAL_ANSWER_TIME_LIMIT = 30;

export default {
  [BUZZ_IN](context, game) {
    this.killTimers();
    this.startTimer(context, game, ANSWER_TIME_LIMIT, QUESTION_BUZZ_TIME_OUT);
  },
  [BUZZ_TIMEOUT](context, game, callback) {
    this.killTimers();
    this.showAnswer(context, game, callback);
  },
  [QUESTION_PICKED](context, game) {
    this.killTimers();
    this.startTimer(context, game, BUZZ_IN_TIME_LIMIT, QUESTION_BUZZ_TIME_OUT);
  },
  [CORRECT_ANSWER](context, game, callback) {
    this.killTimers();
    this.showAnswer(context, game, callback);
  },
  [FINAL](context, game) {
    this.killTimers();
    this.startTimer(context, game, BID_TIME_LIMIT, FINAL_BID_TIME_OUT);
  },
  [FINAL_ANSWER](context, game) {
    this.killTimers();
    this.startTimer(context, game, FINAL_ANSWER_TIME_LIMIT, FINAL_ANSWER_TIME_OUT);
  },
  [INCORRECT_ANSWER](context, game, callback) {
    this.killTimers();
    if (!game.allPlayersAttempted) {
      // show the incorrect answer
      this.showAnswer(context, game, () => {
        this.startTimer(context, game, BUZZ_IN_TIME_LIMIT, QUESTION_BUZZ_TIME_OUT);
      });
    } else {
      this.showAnswer(context, game, callback);
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
  showAnswer(context, game, callback) {
    this.startBooleanTimer(context, game, 'showAnswer', SHOW_ANSWER_TIME_LIMIT, callback);
  },
  showRoundTitle(context, game) {
    this.startBooleanTimer(context, game, 'showRoundTitle', SHOW_ROUND_TITLE_TIME_LIMIT);
  },
  startBooleanTimer(context, game, property, limit, callback) {
    Vue.set(game, property, true);
    context.commit('game', game);
    this.countdownTimer = setTimeout(() => {
      Vue.set(game, property, false);
      context.commit('game', game);
      if (callback) {
        callback();
      }
    }, SECOND * limit);
  },
  startTimer(context, game, limit, dispatcher, callback) {
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
      if (callback) {
        callback();
      }
    }, SECOND * limit);
  },
};
