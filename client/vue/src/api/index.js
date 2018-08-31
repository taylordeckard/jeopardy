import {
  GameResource,
  GamePlayerResource,
  LobbyGamesResource,
  QuestionsResource,
  RegisterUsernameResource,
} from './resources';

export default {
  addPlayer(gameId, player, socketId) {
    return GamePlayerResource.save({ gameId }, { player, socketId });
  },
  registerUsername(username) {
    return RegisterUsernameResource.save({ username });
  },
  createGame(socketId) {
    return LobbyGamesResource.save({ socketId });
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
