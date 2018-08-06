<template>
  <div class="main"></div>
</template>

<script>
export default {
  name: 'MainWindow',
  props: {
    msg: String,
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
