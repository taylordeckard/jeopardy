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
const SHOW_PICKED_TILE_TIME_LIMIT = 0.75;
const SHOW_IMAGE_CLUE_TIME_LIMIT = 2;
const FINAL_ANSWER_TIME_LIMIT = 30;

export default {
  [BUZZ_IN](context, game) {
    this.killTimers();
    return this.startTimer(context, game, ANSWER_TIME_LIMIT, QUESTION_BUZZ_TIME_OUT);
  },
  [BUZZ_TIMEOUT](context, game) {
    this.killTimers();
    return this.showAnswer(context, game);
  },
  [QUESTION_PICKED](context, game) {
    this.killTimers();
    return this.startTimer(context, game, BUZZ_IN_TIME_LIMIT, QUESTION_BUZZ_TIME_OUT);
  },
  [CORRECT_ANSWER](context, game) {
    this.killTimers();
    return this.showAnswer(context, game);
  },
  [FINAL](context, game) {
    this.killTimers();
    return this.startTimer(context, game, BID_TIME_LIMIT, FINAL_BID_TIME_OUT);
  },
  [FINAL_ANSWER](context, game) {
    this.killTimers();
    return this.startTimer(context, game, FINAL_ANSWER_TIME_LIMIT, FINAL_ANSWER_TIME_OUT);
  },
  async [INCORRECT_ANSWER](context, game) {
    this.killTimers();
    if (!game.allPlayersAttempted) {
      // show the incorrect answer
      await this.showAnswer(context, game);
      return this.startTimer(context, game, BUZZ_IN_TIME_LIMIT, QUESTION_BUZZ_TIME_OUT);
    }

    return this.showAnswer(context, game);
  },
  killTimers() {
    if (this.countdownInterval) {
      clearInterval(this.countdownInterval);
    }
    if (this.countdownTimer) {
      clearTimeout(this.countdownTimer);
    }
    if (this.cancelTimerPromise) {
      this.cancelTimerPromise();
    }
  },
  showAnswer(context, game) {
    return new Promise((resolve, reject) => {
      this.cancelTimerPromise = reject;
      this.startBooleanTimer(
        context,
        game,
        'showAnswer',
        SHOW_ANSWER_TIME_LIMIT,
        resolve,
      );
    });
  },
  showRoundTitle(context, game) {
    return new Promise((resolve, reject) => {
      this.cancelTimerPromise = reject;
      this.startBooleanTimer(
        context,
        game,
        'showRoundTitle',
        SHOW_ROUND_TITLE_TIME_LIMIT,
        resolve,
      );
    });
  },
  showAudioVideoClue(context, game, audioClipLength) {
    return new Promise((resolve, reject) => {
      this.cancelTimerPromise = reject;
      this.startBooleanTimer(
        context,
        game,
        null,
        audioClipLength,
        resolve,
      );
    });
  },
  showImageClue(context, game) {
    return new Promise((resolve, reject) => {
      this.cancelTimerPromise = reject;
      this.startBooleanTimer(
        context,
        game,
        null,
        SHOW_IMAGE_CLUE_TIME_LIMIT,
        resolve,
      );
    });
  },
  showPickedTile(context, game) {
    return new Promise((resolve, reject) => {
      this.cancelTimerPromise = reject;
      this.startBooleanTimer(
        context,
        game,
        'showPickedTile',
        SHOW_PICKED_TILE_TIME_LIMIT,
        resolve,
      );
    });
  },
  startBooleanTimer(context, game, property, limit, resolve) {
    if (property) {
      Vue.set(game, property, true);
    }
    context.commit('game', game);
    this.countdownTimer = setTimeout(() => {
      const currentGame = context.state.game;
      if (property) {
        Vue.set(currentGame, property, false);
      }
      context.commit('game', currentGame);
      if (resolve) {
        resolve();
      }
    }, SECOND * limit);
  },
  startTimer(context, game, limit, dispatcher, resolve) {
    Vue.set(game, 'timerOn', true);
    Vue.set(game, 'timer', limit);
    Vue.set(game, 'timerLimit', limit);
    context.commit('game', game);
    this.countdownInterval = setInterval(() => {
      const currentGame = context.state.game;
      Vue.set(currentGame, 'timer', game.timer - 0.1);
      context.commit('game', currentGame);
    }, SECOND / 10);
    this.countdownTimer = setTimeout(() => {
      const currentGame = context.state.game;
      Vue.set(currentGame, 'timerOn', false);
      context.commit('game', currentGame);
      clearInterval(this.countdownInterval); // cancel countdown
      context.dispatch(dispatcher);
      if (resolve) {
        resolve();
      }
    }, SECOND * limit);
  },
};
