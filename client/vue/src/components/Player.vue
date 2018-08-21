<template>
  <div class="player-wrapper" v-if="player" v-bind:class="{ active: player.active }">
    <div class="player base-margin-right">
      <div class="scoreboard" v-bind:class="{ negative }">
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
  computed: {
    negative() {
      if (this.player.score < 0) {
        return true;
      }
      return false;
    },
  },
};
</script>
<style scoped lang="scss">
@import '../assets/variables.scss';
.player-wrapper {
  padding: 2px;
  transition: border .2s;
  &.active {
    border: 2px solid $yellow;
  }
  .player {
    margin: 0px;
    user-select: none;
    .scoreboard {
      background: #07125f;
      border: 2px solid black;
      &.negative {
        color: $red;
      }
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
