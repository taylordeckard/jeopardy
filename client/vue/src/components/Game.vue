<template>
  <div>
    <div v-if="game && !isLoading">
      <Answer v-if="game.showAnswer"></Answer>
      <transition name="fade-in">
        <Grid v-if="
          (game.state === 'PRE_START' || game.state === 'PICK_QUESTION')
          && !game.showAnswer && !game.showRoundTitle && !game.showImageClue
          && !game.showAudioClue && !game.showVideoClue">
        </Grid>
      </transition>
      <transition name="fade-in">
        <Question v-if="
          (game.state === 'QUESTION' || game.state === 'ANSWER')
          && !game.showAnswer && !game.showRoundTitle && !game.showImageClue
          && !game.showAudioClue && !game.showVideoClue">
        </Question>
      </transition>
      <Round v-if="game.showRoundTitle"></Round>
      <transition name="fade">
        <AudioClue v-if="game.showAudioClue"></AudioClue>
      </transition>
      <transition name="fade">
        <ImageClue v-if="game.showImageClue"></ImageClue>
      </transition>
      <transition name="fade">
        <VideoClue v-if="game.showVideoClue"></VideoClue>
      </transition>
      <FinalBid v-if="game.state === 'FINAL'
        && !game.showAnswer && !game.showRoundTitle && !game.showImageClue
        && !game.showAudioClue && !game.showVideoClue">
      </FinalBid>
      <FinalQuestion v-if="
        game.state === 'FINAL_QUESTION'
        && !game.showAnswer && !game.showRoundTitle && !game.showImageClue
        && !game.showAudioClue && !game.showVideoClue"></FinalQuestion>
      <GameResults v-if="
        game.state === 'GAME_RESULTS'
        && !game.showAnswer && !game.showRoundTitle && !game.showImageClue
        && !game.showAudioClue && !game.showVideoClue"></GameResults>
    </div>
    <Loader v-if="isLoading"></Loader>
    <div class="players-bar">
      <Players v-bind:players="game && game.players"></Players>
    </div>
  </div>
</template>
<script>
import { mapActions, mapState } from 'vuex';
import { find } from 'lodash-es';
import Answer from './Answer.vue';
import FinalBid from './FinalBid.vue';
import FinalQuestion from './FinalQuestion.vue';
import GameResults from './GameResults.vue';
import Grid from './Grid.vue';
import Loader from './Loader.vue';
import Players from './Players.vue';
import Question from './Question.vue';
import Round from './Round.vue';
import AudioClue from './AudioClue.vue';
import ImageClue from './ImageClue.vue';
import VideoClue from './VideoClue.vue';

export default {
  name: 'Game',
  components: {
    Answer,
    AudioClue,
    FinalBid,
    FinalQuestion,
    GameResults,
    Grid,
    ImageClue,
    Loader,
    Players,
    Question,
    Round,
    VideoClue,
  },
  data() {
    return {
      isLoading: true,
    };
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
    this.isLoading = false;
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
  bottom: $base-spacing;
  width: 100%;
  z-index: 1000;
  pointer-events: none;
}
</style>
