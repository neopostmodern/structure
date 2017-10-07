// @flow
import { REQUEST_METADATA, receivedMetadata, clearMetadata } from '../actions/userInterface';

export default store => next => action => {
  if (action.type === REQUEST_METADATA) {
    fetch(action.payload) // , { mode: 'no-cors' }
      .then(response => response.text())
      .then(html => {
        const dom = new DOMParser().parseFromString(html, 'text/html');
        let metaTitles = Array.from(dom.querySelectorAll('meta'))
          .filter(meta => {
            const name = meta.getAttribute('name');
            return name && name.includes('title');
          })
          .map(meta => meta.content);
        // de-duplicate
        metaTitles = metaTitles.filter(
          (metaTitle, index) => metaTitles.indexOf(metaTitle) === index
        );

        const titles = [
          dom.querySelector('title').innerHTML,
          ...metaTitles
        ];
        next(receivedMetadata({ titles }));
      })
      .catch(clearMetadata);
  }
  return next(action);
};
