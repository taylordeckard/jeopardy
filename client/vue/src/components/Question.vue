<template>
  <div class="question">
    <div class="absolute-center text-center" v-html="questionText"></div>
    <div v-if="game.state === 'ANSWER'">TEXT INPUT HERE</div>
  </div>
</template>
<script>
import { replace, toUpper } from 'lodash-es';
import { mapActions, mapState } from 'vuex';

export default {
  name: 'Question',
  created() {
    window.addEventListener('keyup', this.onKeyUp);
  },
  destroyed() {
    window.removeEventListener('keyup', this.onKeyUp);
  },
  computed: {
    ...mapState('game', { game: state => state.game }),
    questionText() {
      return toUpper(replace(this.game.currentQuestion.question, /(^'|'$)/, ''));
    },
  },
  methods: {
    ...mapActions('game', ['buzzIn']),
    onKeyUp(event) {
      if (event.code === 'Space') {
        this.buzzIn();
      }
    },
  },
};
</script>
<style scoped lang="scss">
.question {
  font-size: 3vw;
  input {
    opacity: 5;
  }
}
</style>
