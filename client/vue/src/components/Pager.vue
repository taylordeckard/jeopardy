<template>
  <div v-if="!firstPage || !lastPage">
    <svg class="pager-link" width="24" height="24" viewBox="0 0 24 24"
      v-on:click="$emit('change', 'firstPage')" v-bind:class="{ 'disabled': firstPage }">
      <path d="M18.41 16.59L13.82 12l4.59-4.59L17 6l-6 6 6 6zM6 6h2v12H6z"/>
      <path fill="none" d="M24 24H0V0h24v24z"/>
    </svg>
    <svg class="pager-link" width="24" height="24" viewBox="0 0 24 24"
      v-on:click="$emit('change', 'previousPage')" v-bind:class="{ 'disabled': firstPage }">
      <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z"/>
      <path d="M0 0h24v24H0z" fill="none"/>
    </svg>
    <svg class="pager-link" width="24" height="24" viewBox="0 0 24 24"
      v-on:click="$emit('change', 'nextPage')" v-bind:class="{ 'disabled': lastPage }">
      <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z"/>
      <path d="M0 0h24v24H0z" fill="none"/>
    </svg>
    <svg class="pager-link" width="24" height="24" viewBox="0 0 24 24"
      v-on:click="$emit('change', 'lastPage')" v-bind:class="{ 'disabled': lastPage }">
      <path d="M5.59 7.41L10.18 12l-4.59 4.59L7 18l6-6-6-6zM16 6h2v12h-2z"/>
      <path fill="none" d="M0 0h24v24H0V0z"/>
    </svg>
  </div>
</template>
<script>
export default {
  name: 'Pager',
  props: ['firstPage', 'lastPage'],
};
</script>
<style scoped lang="scss">
@import '../assets/variables.scss';
svg.pager-link {
  cursor: pointer;
  path:first-child {
    transition: fill .2s, transform .2s;
    fill: white;
  }
  &.disabled {
    opacity: 0.5;
    pointer-events: none;
  }
  &:hover path:first-child {
    fill: $yellow;
    transform: scale(1.1);
  }
  &:active path:first-child {
    transform: scale(1);
  }
}
</style>
