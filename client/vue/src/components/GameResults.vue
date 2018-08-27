<template>
  <div class="absolute-center text-center" v-if="game">
    <div class="text-large base-margin-bottom">{{ winner }} IS THE WINNER!</div>
    <div>CORRECT ANSWER:</div>
    <div class="base-margin-bottom text-yellow">{{ game.currentQuestion.answer }}</div>
    <div class="flex-center-horizontal text-small">
      <div v-for="(player, idx) in game.players" :key="idx">
        <div>
          <span>{{player.username}}</span>
          <span v-if="player.finalAnswer"> ANSWERED</span>
          <span v-if="!player.finalAnswer"> DIDN'T ANSWER</span>
          <span v-if="player.finalAnswer" v-bind:class="{
              'text-yellow': player.isCorrect,
              'text-red': !player.isCorrect
            }"> {{player.finalAnswer}}</span>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { mapState } from 'vuex';
import { get, find } from 'lodash-es';

export default {
  name: 'GameResults',
  computed: {
    ...mapState('game', { game: state => state.game }),
    ...mapState('game', { username: state => state.username }),
    winner() {
      return get(find(this.game.players, { isWinner: true }), 'username');
    },
  },
};
</script>
<style scoped lang="scss"></style>
