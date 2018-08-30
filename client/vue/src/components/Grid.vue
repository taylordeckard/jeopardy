<template>
  <div class="grid-container">
    <div class="grid grid--category" v-bind:class="{
      'grid-5-col': questions.length === 24,
      'grid-6-col': questions.length === 30,
    }">
      <Card v-for="(cat, index) in categories" :key="index" :text="cat" textSmall="true"></Card>
    </div>
    <div class="grid grid--question" v-bind:class="{
      'grid-5-col': questions.length === 24,
      'grid-6-col': questions.length === 30,
    }">
      <Card v-for="(q, index) in questions"
        :key="index"
        v-bind:text="q.value"
        v-bind:clickable="game.state === 'PRE_START' || isActive"
        v-bind:answered="q.answered"
        v-bind:disabled="q.disabled"
        v-bind:highlighted="game.currentQuestion
          && q.question === game.currentQuestion.question
          && game.showPickedTile"
        v-on:click.native="onQuestionClick(q)"
        textColor="yellow">
      </Card>
    </div>
  </div>
</template>
<script>
import { mapActions, mapState } from 'vuex';
import { get, find } from 'lodash-es';
import { PICK_QUESTION } from '../events';
import Card from './Card.vue';

export default {
  name: 'Grid',
  components: {
    Card,
  },
  computed: {
    ...mapState('game', { categories: state => state.categories }),
    ...mapState('game', { game: state => state.game }),
    ...mapState('game', { questions: state => state.questions }),
    ...mapState('game', { username: state => state.username }),
    isActive() {
      const player = find(this.game.players, { username: this.username });
      return get(player, 'active');
    },
  },
  methods: {
    ...mapActions('game', [PICK_QUESTION]),
    async onQuestionClick(question) {
      if (!question.disabled && (this.isActive || this.game.state === 'PRE_START')) {
        await this[PICK_QUESTION](question.id);
      }
    },
  },
};
</script>
<style scoped lang="scss">
@import '../assets/variables.scss';
.grid {
  display: grid;
  grid-gap: 10px;
  &.grid-5-col {
    grid-template-columns: repeat(5, 1fr);
  }
  &.grid-6-col {
    grid-template-columns: repeat(6, 1fr);
  }
  width: calc(100% - 20px);
  padding: 10px;
  grid-auto-flow: column;
  background: black;
  &--category {
    height: 13vh;
    padding-bottom: 0;
    grid-template-rows: repeat(1, 1fr);
  }
  &--question {
    height: 70vh;
    padding-top: 13px;
    grid-template-rows: repeat(5, 1fr);
  }
  &-container {
    @include shadow;
  }
}
</style>
