import axios from 'axios';
import getSchema from './schema.js';
import parseXml from './parser.js';

const PROXY_URL = 'https://allorigins.hexlet.app/get';

const verifyUrl = (state, inputValue) => {
  state.ui.urlInput = inputValue;
  getSchema(state.data.feeds)
    .validate({ url: state.ui.urlInput, uniqueField: state.ui.urlInput })
    .then(() => {
      state.ui.errors.isUrlValidationError = false;
      state.ui.errors.isUrlConnectionError = false;
      state.ui.errors.isRssParseError = false;
      return true;
    })
    .catch((error) => {
      state.ui.errors.isUrlValidationError = true;
      console.error(error);
      return false;
    });
};

const loadData = (state, url) => {
  const proxyUrl = new URL(PROXY_URL);
  proxyUrl.searchParams.set('disableCache', 'true');
  proxyUrl.searchParams.set('url', url);

  return axios.get(proxyUrl.href)
    .then((response) => response.data.contents)
    .catch((error) => {
      state.ui.errors.isUrlConnectionError = true;
      console.error(error);
      return false;
    });
};

/**
 * @param {import('src/rss-repository.js').state} state
 * @param {FeedType} newFeed
 */
const updateState = (state, newFeed) => {
  if (!newFeed) {
    return;
  }

  const existingFeed = state.data.feeds.find((feed) => feed.url === newFeed.url);
  if (!existingFeed) {
    state.data.feeds.push(newFeed);
    return;
  }

  newFeed.articles.forEach((newArticle) => {
    const foundArticle = existingFeed.articles.find((article) => article.url === newArticle.url);
    if (!foundArticle) {
      existingFeed.articles.push(newArticle);
    }
  });
};

const fetchXmlAndUpdateState = (state, url) => loadData(state, url)
  .then((data) => parseXml(state, data, url))
  .then((data) => updateState(state, data));

const addFeed = (state, urlInputField) => {
  const existingFeed = state.data.feeds.find((feed) => feed.url === state.ui.urlInput);
  if (existingFeed) {
    state.ui.errors.isRssExistsError = true;
    return;
  }

  fetchXmlAndUpdateState(state, state.ui.urlInput)
    .then(() => {
      state.ui.urlInput = '';
      urlInputField.value = '';
      urlInputField.focus();
      state.ui.urlSuccess = true;
    });
};

const setArticleRead = (state, articleId) => {
  state.ui.readArticlesSet.add(articleId);
};

const scheduleFeedUpdates = (state, interval) => {
  setInterval(() => {
    state.data.feeds.forEach((feed) => {
      fetchXmlAndUpdateState(state, feed.url);
    });
  }, interval);
};

export {
  verifyUrl, addFeed, setArticleRead, scheduleFeedUpdates,
};
