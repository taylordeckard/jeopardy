<template>
  <div class="text-center noselect title absolute-center">
    <div class="width-limit">
      <h1>jprdy!</h1>
      <TextInput
        class="text-center"
        v-on:model-change="onNicknameChange"
        placeholder="Enter a Nickname"></TextInput>
    </div>
    <transition name="fade">
      <router-link v-if="showLink" class="link" to="/lobby">START</router-link>
    </transition>
    <br>
  </div>
</template>
<script>
import { mapMutations } from 'vuex';
import TextInput from './TextInput.vue';

export default {
  name: 'Title',
  components: {
    TextInput,
  },
  data() {
    return {
      showLink: false,
    };
  },
  methods: {
    ...mapMutations('game', ['username']),
    onNicknameChange(nickname) {
      if (nickname) {
        this.showLink = true;
      } else {
        this.showLink = false;
      }
      this.username(nickname);
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
  .link {
    @include clue-font;
    color: $yellow;
    font-size: 28px;
    cursor: pointer;
    transition: color .5s;
    text-decoration: none;
    &:hover {
      color: lighten($yellow, 15%);
    }
    &:active {
      position: relative;
      top: 1px;
      color: darken($yellow, 15%);
    }
  }
  .fade-enter-active, .fade-leave-active {
    transition: opacity 1s;
  }
  .fade-enter, .fade-leave-to {
    opacity: 0;
  }
}
</style>
