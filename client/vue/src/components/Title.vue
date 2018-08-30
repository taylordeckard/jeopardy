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
        placeholder="Enter a Nickname"></TextInput>
    </div>
    <transition name="fade">
      <a v-if="showLink" class="link" v-on:click="goToLobby">START</a>
    </transition>
    <br>
  </div>
</template>
<script>
import { mapMutations } from 'vuex';
import { debounce } from 'lodash-es';
import TextInput from './TextInput.vue';
import api from '../api';

export default {
  name: 'Title',
  components: {
    TextInput,
  },
  data() {
    return {
      showLink: false,
      showNameTaken: false,
      nameTaken: true,
    };
  },
  methods: {
    ...mapMutations('game', ['username']),
    goToLobby() {
      if (!this.nameTaken) {
        this.$router.push('/lobby');
      }
    },
    async onNicknameChange(nickname) {
      this.nameTaken = true;
      const debouncedFn = debounce(async () => {
        if (nickname) {
          this.nameTaken = (await api.checkUsername(nickname)).body;
          if (!this.nameTaken) {
            this.showLink = true;
            this.showNameTaken = false;
          } else {
            this.showLink = false;
            this.showNameTaken = true;
          }
        } else {
          this.showLink = false;
        }
        this.username(nickname);
      }, 500);
      await debouncedFn();
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
