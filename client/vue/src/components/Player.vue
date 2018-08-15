<template>
  <div class="player base-margin-right">
    <div class="scoreboard">
      <div class="text-center">${{ player.score }}</div>
    </div>
    <div class="nametag">
      <div class="text-center">{{ player.username }}</div>
    </div>
  </div>
</template>
<script>
export default {
  name: 'Player',
  props: ['player'],
};
</script>
<style scoped lang="scss">
@import '../assets/variables.scss';
.player {
  margin: 6px;
  .scoreboard {
    background: #07125f;
    border: 2px solid black;
  }
  .nametag {
    background: #1d48bf;
    border: 2px solid black;
    padding: 3px;
    > div {
      max-width: 60px;
      @include text-ellipsis;
    }
  }
}
</style>
