<template>
  <div class="flex-center">
    <div class="label base-margin-right">Choose a Year</div>
    <div class="select-container base-margin-right">
      <select ref="selectEl">
        <option>Random</option>
        <option v-for="(y, idx) in years" v-bind:key="idx">{{ y.year }}</option>
      </select>
      <div class="select-options text-left" v-bind:class="{ 'hidden': !showDropdown }">
        <option v-on:click="setValue('Random')">Random</option>
        <option v-for="(y, idx) in years" v-bind:key="idx" v-on:click="setValue(y.year)">
          {{ y.year }}
        </option>
      </div>
      <div class="select text-left" v-bind:class="{ 'active': showDropdown }"
        v-on:click.stop="toggleDropdown()">
        <span v-if="mounted">{{ $refs.selectEl.value }}</span>
      </div>
    </div>
    <a v-on:click="$emit('clickedStart', $refs.selectEl.value)" class="link">START</a>
  </div>
</template>
<script>
export default {
  name: 'YearPicker',
  props: ['years'],
  data() {
    return {
      closeDropdown: this.toggleDropdown.bind(this, false),
      showDropdown: false,
      mounted: false,
    };
  },
  mounted() {
    document.addEventListener('click', this.closeDropdown);
    this.mounted = true;
  },
  destroyed() {
    document.removeEventListener('click', this.closeDropdown);
  },
  methods: {
    toggleDropdown(open) {
      if (typeof open === 'undefined') {
        this.showDropdown = !this.showDropdown;
      } else {
        this.showDropdown = open;
      }
    },
    setValue(value) {
      this.$refs.selectEl.value = value;
    },
  },
};
</script>
<style scoped lang="scss">
@import '../assets/variables.scss';
.select-container {
  position: relative;
  select {
    display: none; /*hide original SELECT element:*/
  }
  .select {
    transition: background .2s;
    background: #dfdfdf;
    border-radius: 1px;
    padding: 6px 50px 6px 6px;
    cursor: pointer;
    color: black;
    font-size: 12px;
    text-shadow: none;
    box-shadow: 2px 2px 2px rgba(0,0,0,.5);
    &:hover {
      background: white;
    }
    &.active {
      background: white;
    }
    &:after {
      position: absolute;
      content: "";
      top: 11px;
      right: 10px;
      width: 0;
      height: 0;
      border: 6px solid transparent;
      border-color: #58585b transparent transparent transparent;
      transition: transform .2s;
    }
  }
  .select-options {
    max-height: 200px;
    overflow: auto;
    background: white;
    position: absolute;
    width: 100%;
    top: 27px;
    option {
      color: black;
      font-size: 12px;
      text-shadow: none;
      transition: background .2s;
      cursor: pointer;
      padding: 6px 30px 6px 6px;
      border-bottom: 1px solid #f2f2f2;
      &:hover {
        background: #dfdfdf;
      }
    }
    &:not(.hidden) ~ .select:after {
      transform: rotate(180deg);
      top: 4px;
    }
  }
}

.hidden {
  display: none;
}

.link {
  font-size: 18px;
}
::-webkit-scrollbar {
    width: 0px;  /* remove scrollbar space */
    background: transparent;  /* optional: just make scrollbar invisible */
}
</style>
