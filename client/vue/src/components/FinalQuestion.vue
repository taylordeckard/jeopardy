<template>
  <div class="question">
    <div class="category">{{ question.category }}</div>
    <div class="absolute-center text-center">
      <div v-html="questionText"></div>
      <div class="base-margin-top text-yellow text-small" v-if="answer">
        YOU ANSWERED: {{ answer }}
      </div>
    </div>
    <div class="answer-input flex-center-horizontal" v-if="!answer">
      <div class="input-container">
        <TextInput
           v-on:enter-key="submitAnswer"
           placeholder="Enter Answer...">
        </TextInput>
      </div>
    </div>
    <transition name="slide-out">
      <Timer v-if="game.timerOn"
        v-bind:seconds="game.timer"
        v-bind:timer-limit="game.timerLimit"></Timer>
    </transition>
  </div>
</template>

<script>
import { replace, toUpper } from 'lodash-es';
import { mapActions, mapState } from 'vuex';
import TextInput from './TextInput.vue';
import Timer from './Timer.vue';
import { FINAL_ANSWER } from '../events';

export default {
  name: 'FinalQuestion',
  components: {
    TextInput,
    Timer,
  },
  created() {
    window.addEventListener('keyup', this.onKeyUp);
  },
  data() {
    return {
      answer: '',
    };
  },
  destroyed() {
    window.removeEventListener('keyup', this.onKeyUp);
  },
  computed: {
    ...mapState('game', { game: state => state.game }),
    ...mapState('game', { question: state => state.show.questions['Final Jeopardy!'] }),
    ...mapState('game', { username: state => state.username }),
    questionText() {
      return toUpper(replace(this.question.question, /(^'|'$)/g, ''));
    },
  },
  methods: {
    ...mapActions('game', [FINAL_ANSWER]),
    submitAnswer(answer) {
      this.answer = answer;
      this[FINAL_ANSWER](answer);
    },
    onKeyUp(event) {
      if (event.code === 'Escape') {
        this.answer = '';
      }
    },
  },
};
</script>

<style scoped lang="scss">
@import '../assets/variables.scss';
.question {
  font-size: 3vw;
  input {
    opacity: 5;
  }
}
.category {
  font-size: 21px;
  margin: $base-spacing;
}
.answer-input {
  position: fixed;
  bottom: 75px;
  width: 100%;
  .input-container {
    width: 40vw;
  }
}
</style>
