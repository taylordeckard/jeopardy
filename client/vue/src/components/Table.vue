<template>
  <div class="text-left table-container flex-center-horizontal">
    <table v-if="config && config.rows && config.rows.length">
      <thead>
        <tr>
          <th v-for="(column, idx) in config.columns" v-bind:key="idx"
              v-on:click="$emit('clickedColHeader', column)"
              v-bind:style="{ 'width': column.width }">
            <div class="flex-center-vertical">
              <span class="link link--small noselect">{{ column.header }}</span>
              <svg v-if="config.currentSort.sortValue === column.sortKey" class="arrow-icon"
                x="0px" y="0px" width="24px" height="24px" viewBox="0 0 24 24"
                enable-background="new 0 0 24 24" xml:space="preserve">
                <g id="Bounding_Boxes">
                <path fill="none" d="M0,0h24v24H0V0z"/>
                </g>
                <g id="Rounded">
                <path v-bind:class="{ 'rotated': config.currentSort.sortDir === 'ASC' }"
                  d="M8.71,11.71l2.59,2.59c0.39,0.39,1.02,0.39,1.41,0l2.59-2.59c0.63-0.63,
                  0.18-1.71-0.71-1.71H9.41C8.52,10,8.08,11.08,8.71,11.71z"/>
                </g>
              </svg>
            </div>
          </th>
        </tr>
      </thead>
      <tbody>
        <tr v-bind:class="{ 'alt': config.currentSort.sortDir === 'ASC' }"
          v-for="(row, idx) in config.rows" v-bind:key="idx">
          <td v-for="(column, idx) in config.columns"
            v-bind:key="idx"
            v-html="row[column.key]"></td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
<script>
export default {
  name: 'Table',
  props: ['config'],
};
</script>
<style scoped lang="scss">
@import '../assets/variables.scss';
.table-container {
  width: 80vw;
  margin: auto;
  table {
    width: 100%;
    border-collapse: collapse;
    th #Rounded path {
      fill: $yellow;
      &.rotated {
        transform: rotate(180deg) translate(-24px, -25px);
      }
    }
    td {
      padding: 6px;
    }
    tbody tr {
      &:not(.alt):nth-child(even) {
        background: lighten($bg-color, 10%);
      }
      &.alt:nth-child(odd) {
        background: lighten($bg-color, 10%);
      }
    }
  }
}
</style>
