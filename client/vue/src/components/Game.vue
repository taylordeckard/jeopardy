<template>
  <div>
    <Grid v-if="questions.length"></Grid>
    <Loader v-if="!questions.length"></Loader>
  </div>
</template>
<script>
import { mapActions, mapState } from 'vuex';
import Grid from './Grid.vue';
import Loader from './Loader.vue';

export default {
  name: 'Game',
  components: {
    Grid,
    Loader,
  },
  async created() {
    if (!this.username) {
      this.$router.push('/');
    }
    this.getQuestions();
  },
  computed: {
    ...mapState('game', { username: state => state.username }),
    ...mapState('game', { questions: state => state.questions }),
  },
  methods: {
    ...mapActions('game', ['getQuestions']),
  },
};
</script>
<style></style>
