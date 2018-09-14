<template>
  <div class="text-center">
    <div v-if="!isLoading">
      <h1 class="title-font">LEADERBOARD</h1>
      <Table v-bind:config="tableCfg" v-on:clickedColHeader="sort"></Table>
      <Pager
        v-on:change="onPagerChange"
        v-bind:firstPage="isFirstPage"
        v-bind:lastPage="isLastPage">
      </Pager>
    </div>
    <Loader v-else></Loader>
    <div class="absolute-center"
      v-if="tableCfg && tableCfg.rows && !tableCfg.rows.length">LEADERBOARD IS EMPTY</div>
  </div>
</template>
<script>
import { get } from 'lodash-es';
import api from '../api';
import LeaderboardTableCfg from '../configs/LeaderboardTableCfg';
import Pager from './Pager.vue';
import Table from './Table.vue';
import Loader from './Loader.vue';

export default {
  name: 'Leaderboard',
  components: {
    Loader,
    Pager,
    Table,
  },
  data() {
    return {
      isFirstPage: true,
      isLastPage: false,
      isLoading: true,
      lastPage: 0,
      page: 0,
      sortDir: 'DESC',
      sortValue: 'num_games_won',
      tableCfg: null,
    };
  },
  methods: {
    async getLeaderboard() {
      this.isLoading = true;
      const leaderboardResponse = await api.getLeaderboard({
        page: this.page,
        sortDir: this.sortDir,
        sortValue: this.sortValue,
      });
      this.isLoading = false;
      this.tableCfg = new LeaderboardTableCfg(
        get(leaderboardResponse, 'body.rows'),
        this.sortValue,
        this.sortDir,
      );
      this.lastPage = get(leaderboardResponse, 'body.lastPage');
      this.isFirstPage = this.page === 0;
      this.isLastPage = get(leaderboardResponse, 'body.isLastPage');
    },
    onPagerChange(goto) {
      switch (goto) {
        case 'firstPage': {
          this.page = 0;
          this.getLeaderboard();
          break;
        }
        case 'previousPage': {
          if (!this.isFirstPage) {
            this.page -= 1;
          }
          this.getLeaderboard();
          break;
        }
        case 'nextPage': {
          if (!this.lastpage) {
            this.page += 1;
          }
          this.getLeaderboard();
          break;
        }
        case 'lastPage': {
          this.page = this.lastPage;
          this.getLeaderboard();
          break;
        }
        default:
      }
    },
    sort(column) {
      this.sortDir = this.sortDir === 'DESC' ? 'ASC' : 'DESC';
      this.sortValue = column.sortKey;
      this.getLeaderboard();
    },
  },
  async created() {
    this.getLeaderboard();
  },
};
</script>
<style scoped lang="scss"></style>
