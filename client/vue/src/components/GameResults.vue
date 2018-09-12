<template>
  <div class="absolute-center text-center" v-if="game">
    <div class="text-large base-margin-bottom" v-if="noWinners">NOBODY WINS</div>
    <div class="text-large base-margin-bottom" v-else-if="tie">DRAW</div>
    <div class="text-large base-margin-bottom" v-else>{{ winner }} IS THE WINNER!</div>
    <div>CORRECT ANSWER:</div>
    <div class="base-margin-bottom text-yellow">{{ game.currentQuestion.answer }}</div>
    <div class="flex-center-horizontal text-small">
      <div class="base-margin" v-for="(player, idx) in players" :key="idx">
        <div>
          <div>{{player.username}}</div>
          <div v-if="player.finalAnswer"> ANSWERED</div>
          <div v-if="!player.finalAnswer"> DIDN'T ANSWER</div>
          <div v-if="player.finalAnswer" v-bind:class="{
              'text-yellow': player.isCorrect,
              'text-red': !player.isCorrect
            }"> {{player.finalAnswer}}</div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { mapState } from 'vuex';
import { cloneDeep, every, get, groupBy, find, maxBy, some } from 'lodash-es';

let computedTie;
let computedNoWinners;
let computedWinner;
let computedPlayers;
let computedFnlQuestion;

export default {
  name: 'GameResults',
  computed: {
    ...mapState('game', { game: state => state.game }),
    ...mapState('game', { username: state => state.username }),
    tie() {
      if (!computedTie) {
        // tie if two player's score is the same
        const dupScoreGroups = groupBy(this.game.players, 'score');
        const maxScore = maxBy(this.game.players, 'score');
        computedTie = some(dupScoreGroups, sg => sg.length > 1 && get(sg, 'score') === maxScore);
      }
      return computedTie;
    },
    noWinners() {
      if (!computedNoWinners) {
        computedNoWinners = every(this.game.players, player => player.score <= 0);
      }
      // no winners if every player's score is 0 or less
      return computedNoWinners;
    },
    winner() {
      if (!computedWinner) {
        computedWinner = get(find(this.game.players, { isWinner: true }), 'username');
      }
      return computedWinner;
    },
    players() {
      if (!computedPlayers) {
        computedPlayers = cloneDeep(this.game.players);
      }
      return computedPlayers;
    },
    fnlQuestion() {
      if (!computedFnlQuestion) {
        computedFnlQuestion = cloneDeep(this.game.currentQuestion);
      }
      return computedFnlQuestion;
    },
  },
};
</script>
<style scoped lang="scss"></style>
