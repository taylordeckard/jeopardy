<template>
  <Title></Title>
</template>

<script>
import Title from './Title.vue';

export default {
  name: 'MainWindow',
  components: {
    Title,
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.main {
  background: #071484;
  height: 100%;
  width: 100%;
}
</style>
