/* eslint-disable no-param-reassign */
import path from 'path';
import rimraf from 'rimraf';
import websiteScaper from 'website-scraper';

import config from './config.json';

export function scrapedWebsiteDirectory(link) {
  return path.join(config.DATA_DIRECTORY, link._id.toString());
}

export function scrapeWebsiteForLink(link, override = false) {
  const directory = scrapedWebsiteDirectory(link);
  return new Promise((resolve, reject) => {
    if (override) {
      rimraf(directory, (error) => {
        if (error) {
          console.log(`scrapeWebsiteForLink: Error when cleaning directory ${directory} for override: `, error);
          resolve();
        } else {
          resolve();
        }
      });
    } else {
      resolve();
    }
  }).then(() => {
    // todo: doesn't work for non-HTML (PDFs, images...)
    link.scrapedAt = 0;
    link.save();
    return websiteScaper({ urls: [link.url], directory })
      .then(() => {
        link.scrapedAt = new Date();
        console.log(link);
        return link.save().then(() => directory);
      })
      .catch((error) => {
        link.scrapedAt = null;
        link.save();
        throw error;
      });
  });
}
