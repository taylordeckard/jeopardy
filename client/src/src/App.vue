<template>
  <div id="app">
    <MainWindow></MainWindow>
    <h1>JEOPARDY!</h1>
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
@font-face {
  font-family: 'KorinnaBold';
  src: url('./assets/fonts/KorinnaBold.eot?#iefix') format('embedded-opentype'),
    url('./assets/fonts/KorinnaBold.woff') format('woff'),
    url('./assets/fonts/KorinnaBold.ttf')  format('truetype'),
    url('./assets/fonts/KorinnaBold.svg#KorinnaBold') format('svg');
  font-weight: normal;
  font-style: normal;
}
#app {
}
body {
  background: #071484;
  color: white;
  font-family: 'KorinnaBold' !important;
  font-weight: normal;
  font-style: normal;
  text-shadow: 2px 2px 2px black;
}
</style>
