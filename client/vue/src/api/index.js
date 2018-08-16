import {
  GameResource,
  GamePlayerResource,
  LobbyGamesResource,
  QuestionsResource,
} from './resources';

export default {
  addPlayer(gameId, player) {
    return GamePlayerResource.save({ gameId }, { player });
  },
  createGame(username) {
    return LobbyGamesResource.save({ username });
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
