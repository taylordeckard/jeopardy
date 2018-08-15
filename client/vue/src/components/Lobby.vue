<template>
  <div class="games-list">
    <div v-if="games.length" class="absolute-center text-center">
      <div class="games-list-item text-left qtr-margin-bottom flex"
        v-for="(game, idx) in games"
        :key="idx">
        <div class="game-title base-margin">{{ game.name }}</div>
        <Player v-for="(p, idx) in game.players" :key="idx" v-bind:player="p"></Player>
      </div>
      <div class="base-margin-top" v-if="!isHost">
        <a class="link" v-on:click="createGame(username)">CREATE GAME</a>
      </div>
    </div>
    <div v-else class="text-center absolute-center">
      <div class="text-large">NO GAMES AVAILABLE</div>
      <div class="base-margin-top" v-if="!isHost">
        <a class="link" v-on:click="createGame(username)">CREATE GAME</a>
      </div>
    </div>
  </div>
</template>
<script>
import { mapActions, mapState } from 'vuex';
import { find } from 'lodash-es';
import Player from './Player.vue';

export default {
  name: 'Lobby',
  components: {
    Player,
  },
  async created() {
    if (!this.username) {
      this.$router.push('/');
      return;
    }
    await this.getGames();
    await this.getSocket();
    await this.subscribe();
  },
  async destroyed() {
    await this.unsubscribe();
  },
  computed: {
    ...mapState('game', { username: state => state.username }),
    ...mapState('lobby', { games: state => state.games }),
    isHost() {
      return find(this.games, game => game.host.username === this.username);
    },
  },
  methods: {
    ...mapActions('lobby', ['createGame']),
    ...mapActions('lobby', ['getSocket']),
    ...mapActions('lobby', ['getGames']),
    ...mapActions('lobby', ['subscribe']),
    ...mapActions('lobby', ['unsubscribe']),
  },
};
</script>
<style scoped lang="scss">
@import '../assets/variables.scss';
.games-list {
  position: relative;
  width: 100vw;
  height: 100vh;
  overflow: auto;
  .games-list-item {
    @include shadow;
    width: 80vw;
    border: 4px solid black;
    border-radius: 6px;
    cursor: pointer;
    transition: background .5s;
    justify-content: space-between;
    &:hover {
      background: lighten($bg-color, 5%)
    }
    &:active {
      box-shadow: none;
      position: relative;
      top: 2px;
    }
  }
}
</style>
