<template>
  <div class="card" v-bind:class="{ clickable, disabled }">
    <div class="text text-center absolute-center"
      v-bind:class="{
        yellow: textColor === 'yellow',
        white: textColor === 'white',
        small: textSmall
      }">{{ text }}</div>
  </div>
</template>
<script>
export default {
  name: 'Card',
  props: ['clickable', 'disabled', 'text', 'textColor', 'textSmall'],
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
    &.small {
      font-size: 1vw;
    }
  }
  &.clickable {
    cursor: pointer;
    &:hover {
      background: darken($bg-color, 5%);
    }
  }
  &.disabled {
    cursor: auto;
    background: desaturate($bg-color, 75%);
    .text {
      color: desaturate($yellow, 75%);
    }
    &:hover {
      background: desaturate($bg-color, 75%);
    }
  }
}
</style>
