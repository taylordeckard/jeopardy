<template>
  <div class="flex-center-vertical">
    <Player v-for="(p, idx) in players" :key="idx" v-bind:player="p"></Player>
  </div>
</template>
<script>
import Player from './Player.vue';

export default {
  name: 'Players',
  props: ['players'],
  components: {
    Player,
  },
};
</script>
<style scoped lang="scss"></style>
