import { each, filter, get, set } from 'lodash-es';

export default {
  preload(questions) {
    each(questions, (question) => {
      if (get(question, 'links.length') > 0) {
        // preload image links
        each(filter(question.links, link => /\.mp3$/.test(link)), (link) => {
          const audio = document.createElement('AUDIO');
          const loadFn = () => {
            const clip = { link, duration: audio.duration + 1 };
            set(question, 'audio', [clip, ...(question.audio || [])]);
            audio.removeEventListener('loadeddata', loadFn);
          };
          audio.addEventListener('loadeddata', loadFn);
          audio.src = link;
        });
      }
    });
  },
};
