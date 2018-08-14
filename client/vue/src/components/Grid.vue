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
        v-bind:clickable="true"
        v-bind:disabled="q.disabled"
        textColor="yellow">
      </Card>
    </div>
  </div>
</template>
<script>
import { mapState } from 'vuex';
import Card from './Card.vue';

export default {
  name: 'Grid',
  components: {
    Card,
  },
  computed: {
    ...mapState('game', { questions: state => state.questions }),
    ...mapState('game', { categories: state => state.categories }),
  },
};
</script>
<style scoped lang="scss">
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
    box-shadow: 6px 6px 6px rgba(0,0,0,.4);
  }
}
</style>
