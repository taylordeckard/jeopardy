import {
  CheckNameResource,
  GameResource,
  GamePlayerResource,
  LobbyGamesResource,
  QuestionsResource,
} from './resources';

export default {
  addPlayer(gameId, player, socketId) {
    return GamePlayerResource.save({ gameId }, { player, socketId });
  },
  checkUsername(username) {
    return CheckNameResource.get({ username });
  },
  createGame(username, socketId) {
    return LobbyGamesResource.save({ socketId, username });
  },
  getQuestions(showNumber) {
    return QuestionsResource.get({ showNumber });
  },
  getGame(gameId) {
    return GameResource.get({ gameId });
  },
  getGames() {
    return LobbyGamesResource.get();
  },
};
