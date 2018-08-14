<template>
  <div class="game-list">
    <div v-if="games.length">
      <div class="game-list-item" v-for="(game, idx) in games" :key="idx">
        <span class="game-title">{{ game.name }}</span>
      </div>
    </div>
    <div class="text-large text-center absolute-center">NO GAMES AVAILABLE</div>
  </div>
</template>
<script>
import { mapActions, mapState } from 'vuex';

export default {
  name: 'Lobby',
  async created() {
    if (!this.name) {
      this.$router.push('/');
      return;
    }
    await this.getSocket();
    await this.subscribe();
  },
  async destroyed() {
    await this.unsubscribe();
  },
  computed: {
    ...mapState('game', { name: state => state.username }),
    ...mapState('lobby', { games: state => state.games }),
  },
  methods: {
    ...mapActions('lobby', ['getSocket']),
    ...mapActions('lobby', ['subscribe']),
    ...mapActions('lobby', ['unsubscribe']),
  },
};
</script>
<style scoped lang="scss">
.games-list {
  position: relative;
  width: 100vw;
}
</style>
