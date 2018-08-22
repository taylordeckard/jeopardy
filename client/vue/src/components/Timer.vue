<template>
  <div class="timer">
    <div
       v-for="(i, idx) in new Array(9)"
       :key="i"
       class="timer-bar"
       v-bind:class="{ on: isOn(idx) }"></div>
  </div>
</template>

<script>
export default {
  name: 'Timer',
  props: ['seconds', 'timerLimit'],
  methods: {
    isOn(index) {
      const step = this.timerLimit / 6;
      if (this.seconds > (this.timerLimit - step)) {
        return true;
      } else if ((index === 0 || index === 8) && this.seconds > (this.timerLimit - (step * 2))) {
        return true;
      } else if ((index === 1 || index === 7) && this.seconds > (this.timerLimit - (step * 3))) {
        return true;
      } else if ((index === 2 || index === 6) && this.seconds > (this.timerLimit - (step * 4))) {
        return true;
      } else if ((index === 3 || index === 5) && this.seconds > (this.timerLimit - (step * 5))) {
        return true;
      } else if (index === 4 && this.seconds > 0) {
        return true;
      }

      return false;
    },
  },
};
</script>

<style scoped lang="scss">
@import '../assets/variables.scss';
.timer {
  background: silver;
  display: grid;
  grid-gap: 4px;
  grid-auto-flow: column;
  height: 11px;
  position: fixed;
  bottom: 0;
  width: 100%;
  .timer-bar {
    height: 6px;
    margin: 2px;
    grid-template-columns: repeat(9, 1fr);
    grid-template-rows: repeat(1, 4px);
    border-radius: 2px;
    background: black;
    transition: background 1s;
    &.on {
      background: $red;
      box-shadow: 1px 1px 1px 1px darken($red, 15%) inset;
    }
  }
}
</style>
