import Vue from 'vue';
import { each, find, get, set } from 'lodash-es';
import api from '../api';
import socket from '../socket';
import {
  ANSWER, ANSWER_TIME_OUT, BUZZ_IN, BUZZ_TIMEOUT, CORRECT_ANSWER, FINAL, FINAL_ANSWER,
  FINAL_ANSWER_TIME_OUT, FINAL_BID, FINAL_BID_TIME_OUT, FINAL_QUESTION, INCORRECT_ANSWER,
  PICK_QUESTION, PLAYER_JOINED, PLAYER_LEFT, QUESTION_BUZZ_TIME_OUT, QUESTION_PICKED,
} from '../events';
import { AudioPreloader, ImagePreloader, TimeCtrl, VideoPreloader } from '../utilities';

export default {
  namespaced: true,
  state: {
    categories: [],
    game: null,
    questions: [],
    show: null,
    wsClientId: null,
    username: '',
  },
  mutations: {
    categories(state, categories) {
      Vue.set(state, 'categories', categories);
    },
    game(state, game) {
      Vue.set(state, 'game', game);
    },
    questions(state, questions) {
      Vue.set(state, 'questions', questions);
    },
    show(state, show) {
      Vue.set(state, 'show', show);
    },
    wsClientId(state, wsClientId) {
      Vue.set(state, 'wsClientId', wsClientId);
    },
    username(state, username) {
      Vue.set(state, 'username', username);
    },
  },
  actions: {
    async addPlayer(context, username) {
      const socketId = context.state.wsClientId;
      await api.addPlayer(context.state.game.id, username, socketId);
    },
    async [BUZZ_IN](context) {
      const event = BUZZ_IN;
      const gameId = context.state.game.id;
      const { username } = context.state;
      await socket.client.message({ event, gameId, username });
    },
    async getGame(context, gameId) {
      const game = (await api.getGame(gameId)).body;
      context.commit('game', game);
      TimeCtrl.showRoundTitle(context, game);
    },
    async getQuestions(context, showNumber) {
      const show = (await api.getQuestions(showNumber)).body;
      each(show.questions, qs => ImagePreloader.preload(qs));
      each(show.questions, qs => AudioPreloader.preload(qs));
      each(show.questions, qs => VideoPreloader.preload(qs));
      context.commit('questions', show.questions[context.state.game.round]);
      context.commit('categories', show.categories[context.state.game.round]);
      context.commit('show', show);
    },
    async getSocket(context) {
      if (!socket.client || !socket.client.id) {
        // don't try to connect if already connected
        await socket.client.connect();
      }
      context.commit('wsClientId', socket.client.id);
    },
    async subscribe(context) {
      await socket.client.subscribe('/game', async (msg/* , flags */) => {
        switch (msg.event) {
          case CORRECT_ANSWER: {
            let startNextRound = false;
            if (context.state.game.round !== msg.game.round) {
              context.commit('questions', context.state.show.questions[msg.game.round]);
              context.commit('categories', context.state.show.categories[msg.game.round]);
              startNextRound = true;
            }
            const { id } = context.state.game.currentQuestion;
            const question = find(context.state.show.questions[context.state.game.round], { id });
            question.answered = true;
            await TimeCtrl[CORRECT_ANSWER](context, msg.game);
            if (startNextRound) {
              TimeCtrl.showRoundTitle(context, msg.game);
            }
            break;
          }
          case INCORRECT_ANSWER: {
            let startNextRound = false;
            if (context.state.game.round !== msg.game.round) {
              context.commit('questions', context.state.show.questions[msg.game.round]);
              context.commit('categories', context.state.show.categories[msg.game.round]);
              startNextRound = true;
            }
            if (msg.game.allPlayersAttempted) {
              const { id } = context.state.game.currentQuestion;
              const question = find(context.state.show.questions[context.state.game.round], { id });
              question.answered = true;
            }
            await TimeCtrl[INCORRECT_ANSWER](context, msg.game);
            if (startNextRound) {
              TimeCtrl.showRoundTitle(context, msg.game);
            }
            break;
          }
          case BUZZ_IN: {
            TimeCtrl[BUZZ_IN](context, msg.game);
            break;
          }
          case BUZZ_TIMEOUT: {
            let startNextRound = false;
            if (context.state.game.round !== msg.game.round) {
              context.commit('questions', context.state.show.questions[msg.game.round]);
              context.commit('categories', context.state.show.categories[msg.game.round]);
              startNextRound = true;
            }
            const { id } = context.state.game.currentQuestion;
            const question = find(context.state.show.questions[context.state.game.round], { id });
            question.answered = true;
            await TimeCtrl[BUZZ_TIMEOUT](context, msg.game);
            if (startNextRound) {
              TimeCtrl.showRoundTitle(context, msg.game);
            }
            break;
          }
          case QUESTION_PICKED: {
            const { currentQuestion, state } = msg.game;
            const { id } = currentQuestion;
            const question = find(context.state.show.questions[context.state.game.round], { id });
            set(msg, 'game.state', PICK_QUESTION);
            await TimeCtrl.showPickedTile(context, msg.game);
            if (get(question, 'images.length')) {
              Vue.set(context.state.game, 'showImageClue', true);
              for (let i = 0; i < question.images.length; i += 1) {
                // show all of the image clues before showing the question
                Vue.set(context.state.game, 'imageClueSrc', question.images[i]);
                // eslint-disable-next-line no-await-in-loop
                await TimeCtrl.showImageClue(context, msg.game);
              }
              Vue.set(context.state.game, 'showImageClue', false);
            }
            if (get(question, 'audio.length')) {
              Vue.set(context.state.game, 'showAudioClue', true);
              for (let i = 0; i < question.audio.length; i += 1) {
                // show all of the audio clues before showing the question
                Vue.set(context.state.game, 'audioClueSrc', question.audio[i].link);
                // eslint-disable-next-line no-await-in-loop
                await TimeCtrl.showAudioVideoClue(context, msg.game, question.audio[i].duration);
              }
              Vue.set(context.state.game, 'showAudioClue', false);
            }
            if (get(question, 'video.length')) {
              Vue.set(context.state.game, 'showVideoClue', true);
              for (let i = 0; i < question.video.length; i += 1) {
                // show all of the video clues before showing the question
                Vue.set(context.state.game, 'videoClueSrc', question.video[i].link);
                // eslint-disable-next-line no-await-in-loop
                await TimeCtrl.showAudioVideoClue(context, msg.game, question.video[i].duration);
              }
              Vue.set(context.state.game, 'showVideoClue', false);
            }
            set(msg, 'game.state', state);
            TimeCtrl[QUESTION_PICKED](context, msg.game);
            break;
          }
          case FINAL_BID_TIME_OUT: {
            TimeCtrl[FINAL_ANSWER](context, msg.game);
            break;
          }
          case ANSWER_TIME_OUT: {
            TimeCtrl[QUESTION_PICKED](context, msg.game);
            break;
          }
          case FINAL_QUESTION:
          case PLAYER_JOINED:
          case PLAYER_LEFT:
          default:
        }
        context.commit('game', msg.game);
      });
    },
    async unsubscribe() {
      TimeCtrl.killTimers();
      await socket.client.unsubscribe('/game', null);
    },
    async [ANSWER](context, answer) {
      const event = ANSWER;
      const gameId = context.state.game.id;
      const { username } = context.state;
      await socket.client.message({
        event, gameId, answer, username,
      });
    },
    async [FINAL](context) {
      TimeCtrl[FINAL](context, context.state.game);
    },
    async [FINAL_ANSWER](context, answer) {
      const event = FINAL_ANSWER;
      const gameId = context.state.game.id;
      const { username } = context.state;
      await socket.client.message({
        event, gameId, answer, username,
      });
    },
    async [FINAL_ANSWER_TIME_OUT](context) {
      const event = FINAL_ANSWER_TIME_OUT;
      const gameId = context.state.game.id;
      const { username } = context.state;
      await socket.client.message({ event, gameId, username });
    },
    async [FINAL_BID](context, bid) {
      const event = FINAL_BID;
      const gameId = context.state.game.id;
      const { username } = context.state;
      await socket.client.message({
        event, gameId, bid, username,
      });
    },
    async [FINAL_BID_TIME_OUT](context) {
      const event = FINAL_BID_TIME_OUT;
      const gameId = context.state.game.id;
      const { username } = context.state;
      await socket.client.message({ event, gameId, username });
    },
    async [PICK_QUESTION](context, questionId) {
      const gameId = context.state.game.id;
      const event = PICK_QUESTION;
      const { username } = context.state;
      await socket.client.message({
        event, gameId, questionId, username,
      });
    },
    async [QUESTION_BUZZ_TIME_OUT](context) {
      const event = QUESTION_BUZZ_TIME_OUT;
      const gameId = context.state.game.id;
      const { username } = context.state;
      await socket.client.message({ event, gameId, username });
    },
  },
  getters: {},
};
