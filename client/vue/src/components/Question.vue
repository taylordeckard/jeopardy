<template>
  <div class="question">
    <div class="category">{{ game.currentQuestion.category }}</div>
    <div class="absolute-center text-center" v-html="questionText"></div>
    <div class="answer-input flex-center-horizontal" v-if="game.state === 'ANSWER'">
      <div class="input-container">
        <TextInput
           v-on:enter-key="submitAnswer"
           placeholder="Enter Answer...">
        </TextInput>
      </div>
    </div>
  </div>
</template>
<script>
import { replace, toUpper } from 'lodash-es';
import { mapActions, mapState } from 'vuex';
import TextInput from './TextInput.vue';

export default {
  name: 'Question',
  components: {
    TextInput,
  },
  created() {
    window.addEventListener('keyup', this.onKeyUp);
  },
  destroyed() {
    window.removeEventListener('keyup', this.onKeyUp);
  },
  computed: {
    ...mapState('game', { game: state => state.game }),
    questionText() {
      return toUpper(replace(this.game.currentQuestion.question, /(^'|'$)/g, ''));
    },
  },
  methods: {
    ...mapActions('game', ['buzzIn']),
    ...mapActions('game', ['submitAnswer']),
    onKeyUp(event) {
      if (event.code === 'Space') {
        this.buzzIn();
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
  bottom: 60px;
  width: 100%;
  .input-container {
    width: 40vw;
  }
}
</style>
