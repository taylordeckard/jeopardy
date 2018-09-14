export default class {
  constructor(rows, sortValue, sortDir) {
    this.rows = rows;
    this.currentSort = { sortValue, sortDir };
    this.columns = [
      {
        header: 'Username',
        key: 'username',
        sortKey: 'username',
      },
      {
        header: 'Games Won',
        key: 'numGamesWon',
        sortKey: 'num_games_won',
        width: '150px',
      },
      {
        header: 'Winnings',
        key: 'winnings',
        sortKey: 'winnings',
        width: '150px',
      },
    ];
  }
}
