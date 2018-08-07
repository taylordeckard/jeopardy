<template>
  <div id="app">
    <MainWindow></MainWindow>
  </div>
</template>

<script>
import MainWindow from './components/MainWindow.vue';

export default {
  name: 'app',
  components: {
    MainWindow,
  },
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
  }
</style>
