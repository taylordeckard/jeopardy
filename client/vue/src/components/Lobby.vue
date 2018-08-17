<template>
  <div class="games-list">
    <div v-if="games.length" class="absolute-center text-center">
      <div class="games-list-item text-left qtr-margin-bottom flex"
        v-for="(game, idx) in games"
        :key="idx"
        v-on:click="goToGame(game.id)">
        <div class="game-title base-margin">{{ game.name }}</div>
        <Players v-bind:players="game.players"></Players>
      </div>
      <div class="base-margin-top" v-if="!isHost">
        <a class="link" v-on:click="createGameAndEnter()">CREATE GAME</a>
      </div>
    </div>
    <div v-else class="text-center absolute-center">
      <div class="text-large">NO GAMES AVAILABLE</div>
      <div class="base-margin-top" v-if="!isHost">
        <a class="link" v-on:click="createGameAndEnter()">CREATE GAME</a>
      </div>
    </div>
  </div>
</template>
<script>
import { mapActions, mapState } from 'vuex';
import { find } from 'lodash-es';
import Players from './Players.vue';

export default {
  name: 'Lobby',
  components: {
    Players,
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
    goToGame(gameId) {
      this.$router.push(`/game/${gameId}`);
    },
    async createGameAndEnter() {
      await this.createGame(this.username);
      const justCreatedGame = find(this.games, g => g.host.username === this.username);
      this.$router.push(`/game/${justCreatedGame.id}`);
    },
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
    position: relative;
    @include shadow;
    width: 80vw;
    border: 4px solid black;
    border-radius: 6px;
    cursor: pointer;
    transition: background .5s, box-shadow .2s;
    justify-content: space-between;
    &:hover {
      background: lighten($bg-color, 5%)
    }
    &:active {
      box-shadow: none;
      top: 2px;
    }
  }
}
</style>
