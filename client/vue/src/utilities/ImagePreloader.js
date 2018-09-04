import { each, filter, get, set } from 'lodash-es';

export default {
  preload(questions) {
    each(questions, (question) => {
      if (get(question, 'links.length') > 0) {
        // preload image links
        each(filter(question.links, link => /\.jpg$/.test(link)), (link) => {
          const image = new Image();
          const loadFn = () => {
            set(question, 'images', [link, ...(question.images || [])]);
            image.removeEventListener('load', loadFn);
          };
          image.addEventListener('load', loadFn);
          image.src = link;
        });
      }
    });
  },
};
