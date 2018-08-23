<template>
  <div>
    <div class="absolute-center text-large text-center">
      <div class="dbl-margin-bottom">CATEGORY</div>
      <div class="text-yellow">{{ question.category }}</div>
    </div>
    <div class="bid-input flex-center-horizontal">
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
  </div>
</template>

<script>
import { mapActions, mapState } from 'vuex';
import { find, isNaN } from 'lodash-es';
import NumberInput from './NumberInput.vue';
import { FINAL_BID } from '../events';

export default {
  name: 'Final',
  components: {
    NumberInput,
  },
  data() {
    return {
      bidError: false,
      bid: 0,
    };
  },
  computed: {
    ...mapState('game', { question: state => state.show.questions['Final Jeopardy!'] }),
    ...mapState('game', {
      score: (state) => {
        const { players } = state.game;
        const thisPlayer = find(players, { username: state.username });
        return thisPlayer.score;
      },
    }),
  },
  methods: {
    ...mapActions('game', [FINAL_BID]),
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
