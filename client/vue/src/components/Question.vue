<template>
  <div class="question">
    <div class="category">{{ game.currentQuestion.category }}</div>
    <div class="absolute-center text-center" v-html="questionText"></div>
    <div class="answer-input flex-center-horizontal" v-if="game.state === 'ANSWER' && answering">
      <div class="input-container">
        <TextInput
           v-on:enter-key="ANSWER"
           placeholder="Enter Answer...">
        </TextInput>
      </div>
    </div>
    <Timer v-if="game.timerOn"
      v-bind:seconds="game.timer"
      v-bind:timer-limit="game.timerLimit"></Timer>
  </div>
</template>

<script>
import { find, get } from 'lodash-es';
import { mapActions, mapState } from 'vuex';
import TextInput from './TextInput.vue';
import Timer from './Timer.vue';
import { ANSWER, BUZZ_IN } from '../events';

export default {
  name: 'Question',
  components: {
    TextInput,
    Timer,
  },
  created() {
    window.addEventListener('keyup', this.onKeyUp);
  },
  destroyed() {
    window.removeEventListener('keyup', this.onKeyUp);
  },
  computed: {
    ...mapState('game', { game: state => state.game }),
    ...mapState('game', { username: state => state.username }),
    questionText() {
      return this.game.currentQuestion.question;
    },
    answering() {
      const activePlayer = find(this.game.players, { active: true });
      return get(activePlayer, 'username') === this.username;
    },
  },
  methods: {
    ...mapActions('game', [BUZZ_IN]),
    ...mapActions('game', [ANSWER]),
    onKeyUp(event) {
      const player = find(this.game.players, { username: this.username });
      if (event.code === 'Space' && !player.attempted) {
        this[BUZZ_IN]();
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
