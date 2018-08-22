import Vue from 'vue';
import { find } from 'lodash-es';
import api from '../api';
import socket from '../socket';
import {
  ANSWER, BUZZ_IN, BUZZ_TIMEOUT, CORRECT_ANSWER, INCORRECT_ANSWER, PICK_QUESTION, PLAYER_JOINED,
  PLAYER_LEFT, QUESTION_BUZZ_TIME_OUT, QUESTION_PICKED,
} from '../events';
import { TimeCtrl } from '../utilities';

export default {
  namespaced: true,
  state: {
    categories: [],
    game: null,
    isLoading: false,
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
    isLoading(state, isLoading) {
      Vue.set(state, 'isLoading', isLoading);
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
    },
    async getQuestions(context, showNumber) {
      context.commit('isLoading', true);
      const show = (await api.getQuestions(showNumber)).body;
      context.commit('questions', show.questions[context.state.game.round]);
      context.commit('categories', show.categories[context.state.game.round]);
      context.commit('show', show);
      context.commit('isLoading', false);
    },
    async getSocket(context) {
      if (!socket.client || !socket.client.id) {
        // don't try to connect if already connected
        await socket.client.connect();
      }
      context.commit('wsClientId', socket.client.id);
    },
    async [PICK_QUESTION](context, questionId) {
      const gameId = context.state.game.id;
      const event = PICK_QUESTION;
      await socket.client.message({ event, gameId, questionId });
    },
    async subscribe(context) {
      await socket.client.subscribe('/game', (msg/* , flags */) => {
        switch (msg.event) {
          case CORRECT_ANSWER: {
            const { id } = context.state.game.currentQuestion;
            const question = find(context.state.show.questions[context.state.game.round], { id });
            question.answered = true;
            TimeCtrl[CORRECT_ANSWER](context, msg.game);
            break;
          }
          case INCORRECT_ANSWER:
            if (msg.game.allPlayersAttempted) {
              const { id } = context.state.game.currentQuestion;
              const question = find(context.state.show.questions[context.state.game.round], { id });
              question.answered = true;
            }
            TimeCtrl[INCORRECT_ANSWER](context, msg.game);
            break;
          case BUZZ_IN: {
            TimeCtrl[BUZZ_IN](context, msg.game);
            break;
          }
          case BUZZ_TIMEOUT: {
            const { id } = context.state.game.currentQuestion;
            const question = find(context.state.show.questions[context.state.game.round], { id });
            question.answered = true;
            TimeCtrl[BUZZ_TIMEOUT](context, msg.game);
            break;
          }
          case QUESTION_PICKED: {
            TimeCtrl[QUESTION_PICKED](context, msg.game);
            break;
          }
          case PLAYER_JOINED:
          case PLAYER_LEFT:
          default:
        }
        context.commit('game', msg.game);
      });
    },
    async unsubscribe() {
      await socket.client.unsubscribe('/game', null);
    },
    async [ANSWER](context, answer) {
      const event = ANSWER;
      const gameId = context.state.game.id;
      await socket.client.message({ event, gameId, answer });
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
