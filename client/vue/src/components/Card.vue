<template>
  <div class="card" v-bind:class="{ clickable: clickable }">
    <div class="text absolute-center"
      v-bind:class="{
        yellow: textColor === 'yellow',
        white: textColor === 'white'
      }">{{ text }}</div>
  </div>
</template>
<script>
export default {
  name: 'Card',
  props: ['clickable', 'text', 'textColor'],
};
</script>
<style scoped lang="scss">
@import '../assets/variables.scss';
.card {
  position: relative;
  background: $bg-color;
  transition: background .5s;
  .text {
    font-size: 3vw;
    &.yellow {
      color: $yellow;
    }
    &.white {
      color: white;
    }
  }
  &.clickable {
    cursor: pointer;
    &:hover {
      background: darken($bg-color, 5%);
    }
  }
}
</style>
