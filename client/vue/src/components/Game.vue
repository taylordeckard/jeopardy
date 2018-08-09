<template>
  <div>
    <div>Welcome {{ name }}</div>
    <Grid></Grid>
  </div>
</template>
<script>
import { mapState } from 'vuex';
import Grid from './Grid.vue';

export default {
  name: 'Game',
  components: {
    Grid,
  },
  computed: {
    ...mapState('game', { name: state => state.username }),
  },
};
</script>
<style></style>
