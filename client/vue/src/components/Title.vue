<template>
  <div class="text-center noselect title absolute-center">
    <div class="width-limit">
      <h1>jprdy!</h1>
      <div v-if="showNameTaken" class="text-small text-red clue-font">
        <span>That nickname is in use. Please choose another</span>
      </div>
      <TextInput
        class="text-center"
        v-on:model-change="onNicknameChange"
        v-on:enter-key="start"
        placeholder="Enter a Nickname"></TextInput>
    </div>
    <transition name="fade">
      <a v-if="showLink" class="link" v-on:click="start">START</a>
    </transition>
    <br>
  </div>
</template>
<script>
import { mapMutations } from 'vuex';
import TextInput from './TextInput.vue';
import api from '../api';

export default {
  name: 'Title',
  components: {
    TextInput,
  },
  data() {
    return {
      nickname: '',
      showLink: false,
      showNameTaken: false,
    };
  },
  methods: {
    ...mapMutations('game', ['username']),
    async start() {
      try {
        await api.registerUsername(this.nickname);
        this.$router.push('/lobby');
      } catch (e) {
        this.showNameTaken = true;
      }
    },
    async onNicknameChange(nickname) {
      this.showNameTaken = false;
      if (nickname) {
        this.showLink = true;
      } else {
        this.showLink = false;
      }
      this.username(nickname);
      this.nickname = nickname;
    },
  },
};
</script>
<style scoped lang="scss">
@import '../assets/variables.scss';
.title {
  height: 380px;
  width: 400px;
  .width-limit {
    width: 280px;
    margin: 0px auto;
  }
  @include title-font;
  font-size: 40px;
  .fade-enter-active, .fade-leave-active {
    transition: opacity 1s;
  }
  .fade-enter, .fade-leave-to {
    opacity: 0;
  }
}
</style>
