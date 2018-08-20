<template>
  <input
    ref="input"
    type="text"
    v-bind:placeholder="placeholder"
    v-model="model"
    @keyup="onKeyUp">
</template>
<script>
export default {
  name: 'TextInput',
  props: ['placeholder'],
  mounted() {
    this.$refs.input.focus();
  },
  data: () => ({
    model: '',
  }),
  methods: {
    onKeyUp(event) {
      if (event.code === 'Enter') {
        this.$emit('enter-key', this.model);
      } else {
        this.$emit('model-change', this.model);
      }
    },
  },
};
</script>
<style scoped lang="scss">
@import '../assets/variables.scss';
input {
  width: 100%;
  border-radius: 4px;
  background: $light-gray;
  transition: background 1s;
  height: 30px;
  margin-bottom: 21px;
  border: none;
  padding: 10px;
  -webkit-box-sizing: border-box; /* Safari/Chrome, other WebKit */
  -moz-box-sizing: border-box;    /* Firefox, other Gecko */
  box-sizing: border-box;         /* Opera/IE 8+ */
  box-shadow: 1px 2px 4px rgba(0,0,0,0.5) inset;
  &:focus {
    outline: none;
    background: white;
  }
}
</style>
