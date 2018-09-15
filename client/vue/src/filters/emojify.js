import Vue from 'vue';
import { forOwn } from 'lodash-es';

const trebekTable = {
  ':trebek_surprised': {
    imgUrl: '/images/trebek_surprised.jpg',
  },
  ':trebek_smirk': {
    imgUrl: '/images/trebek_smirk.jpg',
  },
  ':trebek_comeon': {
    imgUrl: '/images/trebek_comeon.jpg',
  },
};

Vue.filter('emojify', (value) => {
  if (!value) return value;
  let emojified = value;
  forOwn(trebekTable, (o, key) => {
    emojified = emojified.replace(key, `<img class="emote-image" src="${o.imgUrl}"></img>`);
  });
  return emojified;
});
