import {
  clearMetadata,
  receivedMetadata,
  REQUEST_METADATA,
} from '../actions/userInterface';
import htmlDecode from '../utils/htmlDecode';

export default (store) => (next) => (action) => {
  if (action.type === REQUEST_METADATA) {
    fetch(action.payload) // , { mode: 'no-cors' }
      .then((response) => response.text())
      .then((html) => {
        const dom = new DOMParser().parseFromString(html, 'text/html');
        const metaTitles = Array.from(dom.querySelectorAll('meta'))
          .filter((meta) => {
            const name = meta.getAttribute('name');
            return name && name.includes('title');
          })
          .map((meta) => meta.content);

        const titleBag = [
          dom.querySelector('title').innerHTML,
          ...metaTitles,
        ].map((rawTitle) => htmlDecode(rawTitle));

        const titles = titleBag.filter(
          (title, index) => titleBag.indexOf(title) === index
        ); // de-duplicate

        next(receivedMetadata({ titles }));
      })
      .catch(clearMetadata);
  }
  return next(action);
};
