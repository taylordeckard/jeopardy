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
    <transition name="slide-out">
      <Timer v-if="game.timerOn" v-bind:seconds="game.timer"></Timer>
    </transition>
  </div>
</template>

<script>
import { replace, toUpper } from 'lodash-es';
import { mapActions, mapState } from 'vuex';
import TextInput from './TextInput.vue';
import Timer from './Timer.vue';

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
    questionText() {
      return toUpper(replace(this.game.currentQuestion.question, /(^'|'$)/g, ''));
    },
    isOn(index) {
      if (this.game.timer > 10) {
        return true;
      } else if ((index === 0 || index === 8) && this.game.timer > 8) {
        return true;
      } else if ((index === 1 || index === 7) && this.game.timer > 6) {
        return true;
      } else if ((index === 2 || index === 6) && this.game.timer > 4) {
        return true;
      } else if ((index === 3 || index === 5) && this.game.timer > 2) {
        return true;
      } else if (index === 4 && this.game.timer > 0) {
        return true;
      }

      return false;
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
.slide-out-enter-active, .slide-out-leave-active {
  transition: bottom 1s;
}
.slide-out-enter, .slide-out-leave-to {
  bottom: -12px;
}
</style>
