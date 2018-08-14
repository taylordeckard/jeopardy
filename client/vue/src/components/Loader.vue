<template>
  <div class="loader">
    <div>J</div><div>P</div><div>R</div><div>D</div><div>Y</div><div>!</div>
  </div>
</template>
<script>
export default {
  name: 'Loader',
};
</script>
<style scoped lang="scss">
@import '../assets/variables.scss';
.loader {
  @include title-font;
  @include absolute-center;
  display: inline-flex;
  font-size: 60px;
  @for $i from 0 to 6 {
    div:nth-child(#{$i + 1}) {
      transform: scaleY(.75);
      animation: bounce 2s ease-in-out infinite;
      animation-delay: .33s * $i;
    }
  }
  @keyframes bounce {
    0%, 100% {
      transform: scaleY(.75);
    }
    50% {
      transform: scaleY(1.25);
    }
  }
}
</style>
