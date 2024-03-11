import axios from 'axios';
import getSchema from './schema.js';

const PROXY_URL = 'https://allorigins.hexlet.app/get';

function verifyUrl(state, inputValue) {
  state.urlInput = inputValue;
  getSchema(state.feeds)
    .validate({ url: state.urlInput, uniqueField: state.urlInput })
    .then(() => {
      state.urlValidateError = false;
      state.urlConnectionError = false;
      state.rssParseError = false;
      return true;
    })
    .catch((error) => {
      state.urlValidateError = true;
      console.error(error);
      return false;
    });
}

function loadData(state, url) {
  const proxyUrl = new URL(PROXY_URL);
  proxyUrl.searchParams.set('disableCache', 'true');
  proxyUrl.searchParams.set('url', url);

  return axios.get(proxyUrl.href)
    .then((response) => response.data.contents)
    .catch((error) => {
      state.urlConnectionError = true;
      console.error(error);
      return false;
    });
}

function parseXml(state, data, feedUrl) {
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
        isRead: false,
        id: crypto.randomUUID(),
      });

      return null;
    });

    return feed;
  } catch (error) {
    state.rssParseError = true;
    console.error(error);
    return null;
  }
}

/**
 * @param {import('src/state-repository.js').state} state - The current state of the application.
 * @param {FeedType} newFeed - The new feed data.
 */
function updateState(state, newFeed) {
  if (!newFeed) {
    return;
  }

  const existingFeed = state.feeds.find((feed) => feed.url === newFeed.url);
  if (!existingFeed) {
    state.feeds.push(newFeed);
    return;
  }

  newFeed.articles.forEach((newArticle) => {
    const foundArticle = existingFeed.articles.find((article) => article.url === newArticle.url);
    if (!foundArticle) {
      existingFeed.articles.push(newArticle);
    }
  });
}

function fetchXmlAndUpdateState(state, url) {
  return loadData(state, url)
    .then((data) => parseXml(state, data, url))
    .then((data) => updateState(state, data));
}

function addFeed(state, urlInputField) {
  if (state.urlValidateError) {
    return;
  }

  const existingFeed = state.feeds.find((feed) => feed.url === state.urlInput);
  if (existingFeed) {
    state.rssExistsError = true;
    return;
  }

  fetchXmlAndUpdateState(state, state.urlInput)
    .then(() => {
      state.urlInput = '';
      urlInputField.value = '';
      urlInputField.focus();
      state.urlSuccess = true;
    });
}

function setArticleRead(state, articleId) {
  state.feeds.forEach((feed) => {
    const foundArticle = feed.articles
      .find((article) => article.id.toString() === articleId.toString());
    if (foundArticle) {
      foundArticle.isRead = true;
    }
  });
}

function scheduleFeedUpdates(state, interval) {
  setInterval(() => {
    state.feeds.forEach((feed) => {
      fetchXmlAndUpdateState(state, feed.url);
    });
  }, interval);
}

export {
  verifyUrl, addFeed, setArticleRead, scheduleFeedUpdates,
};
