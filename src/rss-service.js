import axios from 'axios';
import getSchema from './schema.js';
import parseXml from './parser.js';

const PROXY_URL = 'https://allorigins.hexlet.app/get';

const verifyUrl = (state, inputValue) => {
  const { watchedState } = state;
  watchedState.ui.urlInput = inputValue;
  getSchema(watchedState.data.feeds)
    .validate({
      url: watchedState.ui.urlInput,
      uniqueField: watchedState.ui.urlInput,
    })
    .then(() => {
      watchedState.ui.errors.isUrlValidationError = false;
      watchedState.ui.errors.isUrlConnectionError = false;
      watchedState.ui.errors.isRssParseError = false;
      return true;
    })
    .catch((error) => {
      watchedState.ui.errors.isUrlValidationError = true;
      console.error(error);
      return false;
    });
};

const loadData = (state, url) => {
  const { watchedState } = state;
  const proxyUrl = new URL(PROXY_URL);
  proxyUrl.searchParams.set('disableCache', 'true');
  proxyUrl.searchParams.set('url', url);

  return axios.get(proxyUrl.href)
    .then((response) => response.data.contents)
    .catch((error) => {
      watchedState.ui.errors.isUrlConnectionError = true;
      console.error(error);
      return false;
    });
};

/**
 * @param {import('src/rss-repository.js').initState} state
 * @param {FeedType} newFeed
 */
const updateState = (state, newFeed) => {
  const { watchedState } = state;
  if (!newFeed) {
    return;
  }

  const existingFeed = watchedState.data.feeds.find((feed) => feed.url === newFeed.url);
  if (!existingFeed) {
    watchedState.data.feeds.push(newFeed);
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

const addFeed = (state) => {
  const { watchedState, domRefs } = state;
  const existingFeed = watchedState.data.feeds
    .find((feed) => feed.url === watchedState.ui.urlInput);
  if (existingFeed) {
    watchedState.ui.errors.isRssExistsError = true;
    return;
  }

  fetchXmlAndUpdateState(state, watchedState.ui.urlInput)
    .then(() => {
      watchedState.ui.urlInput = '';
      domRefs.urlInputField.value = '';
      domRefs.urlInputField.focus();
      watchedState.ui.urlSuccess = true;
    });
};

const setArticleRead = (state, articleId) => {
  const { watchedState } = state;
  watchedState.ui.readArticlesSet.add(articleId);
};

const scheduleFeedUpdates = (state, interval) => {
  const { watchedState } = state;
  setInterval(() => {
    watchedState.data.feeds.forEach((feed) => {
      fetchXmlAndUpdateState(state, feed.url);
    });
  }, interval);
};

export {
  verifyUrl, addFeed, setArticleRead, scheduleFeedUpdates,
};
