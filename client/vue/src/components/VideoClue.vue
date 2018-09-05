<template>
  <div class="video-clue">
    <video autoplay="true" v-bind:src="game.videoClueSrc"/>
  </div>
</template>
<script>
import { mapState } from 'vuex';

export default {
  name: 'VideoClue',
  computed: {
    ...mapState('game', { game: state => state.game }),
  },
};
</script>
<style scoped lang=scss>
@import '../assets/variables.scss';
.video-clue {
  @include absolute-center;
  height: 40vh;
}
</style>
