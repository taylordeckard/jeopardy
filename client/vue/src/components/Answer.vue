<template>
  <div class="absolute-center text-center text-medium">
    <div v-if="game.answer.correct">
      <div>{{game.answer.username}}</div>
      <div class="base-margin-bottom">ANSWERED CORRECTLY!</div>
      <div class="correct">{{ game.answer.value }}</div>
    </div>
    <div v-if="!game.answer.correct && game.answer.username" class="base-margin-bottom">
      <div class="base-margin-bottom">{{game.answer.username}} ANSWERED</div>
      <div class="incorrect">{{ game.answer.wrongAnswer }}</div>
    </div>
    <div v-if="!game.answer.correct && game.answer.value">
      <div class="base-margin-bottom">ANSWER:</div>
      <div class="correct">{{ game.answer.value }}</div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex';

export default {
  name: 'Answer',
  computed: {
    ...mapState('game', { game: state => state.game }),
  },
};
</script>

<style scoped lang="scss">
@import '../assets/variables.scss';
.incorrect { color: $red; }
.correct { color: $yellow; }
</style>

