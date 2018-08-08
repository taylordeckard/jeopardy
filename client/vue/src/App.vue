<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  name: 'app',
};
</script>

<style lang="scss">
@import './assets/variables.scss';
#app {
}
body {
  @include clue-font;
  background: $bg-color;
  color: white;
  text-shadow: 2px 2px 2px black;
  background: #071484;
  height: 100%;
  width: 100%;
  margin: 0;
}
</style>
