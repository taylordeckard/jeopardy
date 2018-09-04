<template>
  <div class="image-clue">
    <img v-bind:src="game.imageClueSrc"/>
  </div>
</template>
<script>
import { mapState } from 'vuex';

export default {
  name: 'ImageClue',
  computed: {
    ...mapState('game', { game: state => state.game }),
  },
};
</script>
<style scoped lang=scss>
@import '../assets/variables.scss';
.image-clue {
  @include absolute-center;
  height: 40vh;
}
</style>
