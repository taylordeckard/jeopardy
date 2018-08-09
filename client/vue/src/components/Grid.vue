<template>
  <div class="grid-container">
    <div class="grid grid--category">
      <Card v-for="cat in categories" :key="cat.id"></Card>
    </div>
    <div class="grid grid--question">
      <Card v-for="q in questions"
        :key="q.id"
        v-bind:text="q.id"
        v-bind:clickable="true"
        textColor="yellow">
      </Card>
    </div>
  </div>
</template>
<script>
import Card from './Card.vue';

export default {
  name: 'Grid',
  data: () => ({
    categories: [{ id: 1 }, { id: 2 }, { id: 3 }, { id: 4 }, { id: 5 }, { id: 6 }],
    questions: [
      { id: 1 }, { id: 2 }, { id: 3 }, { id: 4 }, { id: 5 }, { id: 6 }, { id: 7 },
      { id: 8 }, { id: 9 }, { id: 10 }, { id: 11 }, { id: 12 }, { id: 13 }, { id: 14 }, { id: 15 },
      { id: 16 }, { id: 17 }, { id: 18 }, { id: 19 }, { id: 20 }, { id: 21 }, { id: 22 },
      { id: 23 }, { id: 24 }, { id: 25 }, { id: 26 }, { id: 27 }, { id: 28 }, { id: 29 },
      { id: 30 },
    ],
  }),
  components: {
    Card,
  },
};
</script>
<style scoped lang="scss">
.grid {
  display: grid;
  grid-gap: 10px;
  grid-template-columns: repeat(6, 1fr);
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
