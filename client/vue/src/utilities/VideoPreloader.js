import { each, filter, get, set } from 'lodash-es';

export default {
  preload(questions) {
    each(questions, (question) => {
      if (get(question, 'links.length') > 0) {
        // preload image links
        each(filter(question.links, link => /\.mp4$/.test(link)), (link) => {
          const video = document.createElement('VIDEO');
          const loadFn = () => {
            const clip = { link, duration: video.duration };
            set(question, 'video', [clip, ...(question.video || [])]);
            video.removeEventListener('loadeddata', loadFn);
          };
          video.addEventListener('loadeddata', loadFn);
          video.src = link;
        });
      }
    });
  },
};
