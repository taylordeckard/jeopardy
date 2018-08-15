import { GameResource, LobbyGamesResource } from './resources';

export default {
  createGame(username) {
    return LobbyGamesResource.save({ username });
  },
  getQuestions(showNumber) {
    return GameResource.get({ showNumber });
  },
  getGames() {
    return LobbyGamesResource.get();
  },
};
