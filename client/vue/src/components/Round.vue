<template>
  <div class="round-title">
    <div class="absolute-center text-xlarge title-font">
      <transition name="slidefade">
        <div v-if="game.round === 'Jeopardy!' && show">JPRDY!</div>
      </transition>
      <transition name="slidefade">
        <div v-if="game.round === 'Double Jeopardy!' && show">DBL JPRDY!</div>
      </transition>
      <transition name="slidefade">
        <div v-if="game.round === 'Final Jeopardy!' && show">FNL JPRDY!</div>
      </transition>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex';

export default {
  name: 'Round',
  created() {
    const self = this;
    setTimeout(() => {
      self.show = true;
    }, 50);
    setTimeout(() => {
      self.show = false;
    }, 3000);
  },
  data() {
    return {
      show: false,
    };
  },
  computed: {
    ...mapState('game', { game: state => state.game }),
  },
};
</script>

<style scoped lang="scss">
.round-title {
  overflow: hidden;
  position: absolute;
  top: 0; bottom: 0; left: 0; right: 0;
}
.slidefade-enter-active, .slidefade-leave-active {
  transition: opacity 1s, transform 1s;
}
.slidefade-enter {
  transform: translateY(100vh);
  opacity: 0;
}
.slidefade-leave-to {
  transform: translateY(-100vh);
  opacity: 0;
}
</style>
