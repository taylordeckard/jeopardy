<template>
  <div class="absolute-center text-center" v-if="game">
    <div class="text-large base-margin-bottom" v-if="noWinners">NOBODY WINS</div>
    <div class="text-large base-margin-bottom" v-else-if="tie">DRAW</div>
    <div class="text-large base-margin-bottom" v-else>{{ winner }} IS THE WINNER!</div>
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
import { every, get, groupBy, find, some } from 'lodash-es';

export default {
  name: 'GameResults',
  computed: {
    ...mapState('game', { game: state => state.game }),
    ...mapState('game', { username: state => state.username }),
    tie() {
      // tie if two player's score is the same
      const dupScoreGroups = groupBy(this.game.players, 'score');
      return some(dupScoreGroups, sg => sg.length > 1);
    },
    noWinners() {
      // no winners if every player's score is 0 or less
      return every(this.game.players, player => player.score <= 0);
    },
    winner() {
      return get(find(this.game.players, { isWinner: true }), 'username');
    },
  },
};
</script>
<style scoped lang="scss"></style>
