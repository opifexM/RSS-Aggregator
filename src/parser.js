import { Status } from './rss-repository.js';

/** @returns {{feed: FeedType, articles: ArticleType[]}} */
const parseXml = (state, data, url) => {
  try {
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(data, 'text/xml');
    const channel = xmlDoc.querySelector('channel');
    const feedName = channel.querySelector('title').textContent;
    const feedDescription = channel.querySelector('description').textContent;

    /** @type {FeedType} */
    const feed = {
      name: feedName,
      description: feedDescription,
      url,
      id: crypto.randomUUID(),
    };

    const items = channel.querySelectorAll('item');
    /** @type {ArticleType[]} */
    const articles = Array.from(items).map((item) => {
      const articleTitle = item.querySelector('title').textContent;
      const articleSummary = item.querySelector('description').textContent;
      const articleUrl = item.querySelector('link').textContent;
      if (!articleUrl) {
        return null;
      }

      return {
        title: articleTitle,
        summary: articleSummary,
        url: articleUrl,
        id: crypto.randomUUID(),
        feedId: feed.id,
      };
    });

    return { feed, articles };
  } catch (error) {
    throw new Error(Status.RSS_PARSE_ERROR);
  }
};

export default parseXml;
