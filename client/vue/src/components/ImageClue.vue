<template>
  <div class="image-clue">
    <img ref="image" v-bind:class="{ 'scaleHeight': scaleHeight, 'scaleWidth': !scaleHeight }"
      v-bind:src="game.imageClueSrc"/>
  </div>
</template>
<script>
import { mapState } from 'vuex';

export default {
  name: 'ImageClue',
  mounted() {
    window.addEventListener('resize', this.handleResize);
    this.$refs.image.onload = this.handleResize;
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.handleResize);
  },
  data() {
    return {
      scaleHeight: false,
    };
  },
  computed: {
    ...mapState('game', { game: state => state.game }),
  },
  methods: {
    handleResize() {
      const windowHeight = window.innerHeight;
      const windowWidth = window.innerWidth;
      const imgHeight = this.$refs.image.naturalHeight;
      const imgWidth = this.$refs.image.naturalWidth;
      if (windowHeight / windowWidth < imgHeight / imgWidth) {
        this.scaleHeight = true;
      } else {
        this.scaleHeight = false;
      }
    },
  },
};
</script>
<style scoped lang=scss>
@import '../assets/variables.scss';
.image-clue {
  @include absolute-center;
  & img.scaleHeight {
    height: 40vh;
  }
  & img.scaleWidth {
    width: 40vw;
  }
}
</style>
