<template>
  <div class="card" v-bind:class="{ answered, clickable, disabled }">
    <div class="text text-center absolute-center"
      v-bind:class="{
        yellow: textColor === 'yellow',
        red: textColor === 'red',
        white: textColor === 'white',
        small: textSmall
      }">{{ text }}</div>
  </div>
</template>
<script>
export default {
  name: 'Card',
  props: ['answered', 'clickable', 'disabled', 'text', 'textColor', 'textSmall'],
};
</script>
<style scoped lang="scss">
@import '../assets/variables.scss';
.card {
  position: relative;
  background: $bg-color;
  transition: background .5s;
  user-select: none;
  .text {
    font-size: 3vw;
    transition: font-size .2s;
    &.yellow {
      color: $yellow;
    }
    &.white {
      color: white;
    }
    &.red {
      color: $red;
    }
    &.small {
      font-size: 1vw;
    }
  }
  &.clickable {
    cursor: pointer;
    transition: background .5s,
                box-shadow .2s;
    &:hover {
      background: lighten($bg-color, 5%);
    }
    &:active {
      box-shadow: 2px 4px 8px rgba(0,0,0,.5) inset;
      .text {
        font-size: 2.75vw;
      }
    }
  }
  &.answered  {
    cursor: none;
    pointer-events: none;
    .text {
      opacity: 0;
    }
    &:hover {
      background: $bg-color;
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
