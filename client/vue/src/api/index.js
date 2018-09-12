import {
  GameResource,
  GamePlayerResource,
  LobbyGamesResource,
  QuestionsResource,
  QuestionsYearsResource,
  RegisterUsernameResource,
} from './resources';

export default {
  addPlayer(gameId, player, socketId) {
    return GamePlayerResource.save({ gameId }, { player, socketId });
  },
  registerUsername(username) {
    return RegisterUsernameResource.save({ username });
  },
  createGame(socketId, username, year) {
    return LobbyGamesResource.save({ socketId, username, year });
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
  getYears() {
    return QuestionsYearsResource.get();
  },
};
