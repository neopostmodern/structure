/**
 * Make any changes you need to make to the database here
 */

import { scrapeWebsiteForLink } from '../lib/util';
import { Link } from '../lib/mongo';

export async function up() {
  return Link.find()
    .then((links) =>
      Promise.all(links.map((link) => scrapeWebsiteForLink(link, true)))
    );
}

/**
 * Make any changes that UNDO the up function side effects here (if possible)
 */
export async function down() {
  return Link.updateMany({}, { $unset: { scrapedAt: true } });
}
