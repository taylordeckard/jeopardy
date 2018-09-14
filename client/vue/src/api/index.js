import {
  GameResource,
  GamePlayerResource,
  LeaderboardResource,
  LobbyGamesResource,
  QuestionsResource,
  QuestionsYearsResource,
  RegisterUsernameResource,
} from './resources';

export default {
  addPlayer(gameId, player, socketId) {
    return GamePlayerResource.save({ gameId }, { player, socketId });
  },
  createGame(socketId, username, year) {
    return LobbyGamesResource.save({ socketId, username, year });
  },
  getGame(gameId) {
    return GameResource.get({ gameId });
  },
  getGames() {
    return LobbyGamesResource.get();
  },
  getLeaderboard(params) {
    return LeaderboardResource.get(params);
  },
  getQuestions(showNumber) {
    return QuestionsResource.get({ showNumber });
  },
  getYears() {
    return QuestionsYearsResource.get();
  },
  registerUsername(username) {
    return RegisterUsernameResource.save({ username });
  },
};
