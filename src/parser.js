const parseXml = (state, data, feedUrl) => {
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
      url: feedUrl,
      id: crypto.randomUUID(),
      articles: [],
    };

    const articles = channel.querySelectorAll('item');
    articles.forEach((item) => {
      const articleTitle = item.querySelector('title').textContent;
      const articleSummary = item.querySelector('description').textContent;
      const articleUrl = item.querySelector('link').textContent;
      if (!articleUrl) {
        return null;
      }

      feed.articles.push({
        title: articleTitle,
        summary: articleSummary,
        url: articleUrl,
        id: crypto.randomUUID(),
      });

      return null;
    });

    return feed;
  } catch (error) {
    state.ui.errors.isRssParseError = true;
    console.error(error);
    return null;
  }
};

export default parseXml;
