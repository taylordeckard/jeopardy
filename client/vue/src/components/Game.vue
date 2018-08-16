<template>
  <div>
    <Grid v-if="questions.length"></Grid>
    <Loader v-if="!questions.length"></Loader>
    <div class="players-bar">
      <Players v-bind:players="game && game.players"></Players>
    </div>
  </div>
</template>
<script>
import { mapActions, mapState } from 'vuex';
import { find } from 'lodash-es';
import Grid from './Grid.vue';
import Loader from './Loader.vue';
import Players from './Players.vue';

export default {
  name: 'Game',
  components: {
    Grid,
    Loader,
    Players,
  },
  async created() {
    if (!this.username) {
      this.$router.push('/');
      return;
    }
    await this.getSocket();
    await this.subscribe();
    await this.getGame(this.$route.params.id);
    await this.getQuestions(this.game.showNumber);
    if (!find(this.game.players, { username: this.username })) {
      this.addPlayer(this.username);
    }
  },
  async destroyed() {
    this.unsubscribe();
  },
  computed: {
    ...mapState('game', { username: state => state.username }),
    ...mapState('game', { questions: state => state.questions }),
    ...mapState('game', { game: state => state.game }),
  },
  methods: {
    ...mapActions('game', ['addPlayer']),
    ...mapActions('game', ['getGame']),
    ...mapActions('game', ['getQuestions']),
    ...mapActions('game', ['getSocket']),
    ...mapActions('game', ['subscribe']),
    ...mapActions('game', ['unsubscribe']),
  },
};
</script>
<style scoped lang="scss">
@import '../assets/variables.scss';
.players-bar {
  @include flex-center-horizontal
  position: fixed;
  bottom: 0;
  width: 100%;
  z-index: 1000;
  pointer-events: none;
}
</style>
