import { GameResource } from './resources';

export default {
  getQuestions(showNumber) {
    return GameResource.get({ showNumber });
  },
};
