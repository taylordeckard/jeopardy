<template>
  <div>
    <div class="absolute-center text-large text-center">
      <div class="dbl-margin-bottom">CATEGORY</div>
      <div class="text-yellow">{{ question.category }}</div>
      <div class="base-margin-top text-small" v-if="bidPlaced">YOU BID ${{ bid }}</div>
    </div>
    <div class="bid-input flex-center-horizontal" v-if="canBid && !bidPlaced">
      <div class="input-container">
        <NumberInput
          placeholder="Place your bid..."
          v-on:enter-key="submitBid"
          v-on:model-change="validate"
          v-bind:error="bidError"
          min="0"
          v-bind:max="score || 1000">
        </NumberInput>
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
import { mapActions, mapState } from 'vuex';
import { find, isNaN } from 'lodash-es';
import NumberInput from './NumberInput.vue';
import Timer from './Timer.vue';
import { FINAL, FINAL_BID } from '../events';

export default {
  name: 'FinalBid',
  components: {
    NumberInput,
    Timer,
  },
  created() {
    this[FINAL]();
  },
  data() {
    return {
      bid: 0,
      bidError: false,
      bidPlaced: false,
    };
  },
  computed: {
    ...mapState('game', { question: state => state.show.questions['Final Jeopardy!'] }),
    ...mapState('game', { game: state => state.game }),
    ...mapState('game', {
      score: (state) => {
        const { players } = state.game;
        const thisPlayer = find(players, { username: state.username });
        return thisPlayer.score;
      },
    }),
    canBid() {
      if (this.score > 0) {
        return true;
      }

      return false;
    },
  },
  methods: {
    ...mapActions('game', [FINAL_BID]),
    ...mapActions('game', [FINAL]),
    validate(event) {
      const bid = parseInt(event, 10);
      if (isNaN(bid)) {
        this.bidError = true;
        return;
      }
      if (bid > (this.score || 1000) || bid < 0) {
        this.bidError = true;
        return;
      }
      this.bid = bid;
      this.bidError = false;
    },
    submitBid() {
      if (this.bidError) {
        return;
      }
      this[FINAL_BID](this.bid);
      this.bidPlaced = true;
    },
  },
};
</script>

<style scoped lang=scss>
.bid-input {
  position: fixed;
  bottom: 75px;
  width: 100%;
  .input-container {
    width: 40vw;
  }
}
</style>
