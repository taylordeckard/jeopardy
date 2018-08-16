<template>
  <div class="player-wrapper" v-bind:class="{ active: player.active }">
    <div class="player base-margin-right">
      <div class="scoreboard">
        <div class="text-center">${{ player.score }}</div>
      </div>
      <div class="nametag">
        <div class="text-center">{{ player.username }}</div>
      </div>
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
.player-wrapper {
  padding: 2px;
  transition: box-shadow .2s;
  &.active {
    box-shadow: 0px 6px 50px 2px rgba(255, 255, 255, 0.6);
  }
  .player {
    margin: 0px;
    user-select: none;
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
}
</style>
