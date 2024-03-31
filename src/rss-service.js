import axios from 'axios';
import parseXml from './parser.js';
import getSchema from './schema.js';

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
    .catch(() => {
      watchedState.ui.errors.isUrlValidationError = true;
      return false;
    });
};

function getProxyUrl(url) {
  const proxyUrl = new URL(PROXY_URL);
  proxyUrl.searchParams.set('disableCache', 'true');
  proxyUrl.searchParams.set('url', url);
  return proxyUrl;
}

const loadData = (state, url) => {
  const proxyUrl = getProxyUrl(url);

  return axios.get(proxyUrl.href)
    .then((response) => response.data.contents)
    .catch((error) => {
      throw new Error(error);
    });
};

/**
 * @param {import('src/rss-repository.js').initState} state
 * @param {{feed: FeedType, articles: ArticleType[]}} data
 */
const updateState = (state, data) => {
  if (!data) {
    return;
  }

  const { watchedState } = state;
  const { feed: newFeed, articles: newArticles } = data;

  const existingFeed = watchedState.data.feeds.find((feed) => feed.url === newFeed.url);
  if (!existingFeed) {
    watchedState.data.feeds.push(newFeed);
    watchedState.data.articles = [...watchedState.data.articles, ...newArticles];
    return;
  }

  const existingArticles = watchedState.data.articles
    .filter((article) => article.feedId === existingFeed.id);
  if (!existingArticles.length) {
    watchedState.data.articles = [...watchedState.data.articles, ...newArticles];
    return;
  }

  newArticles.forEach((newArticle) => {
    const foundArticle = existingArticles.find((article) => article.url === newArticle.url);
    if (!foundArticle) {
      watchedState.data.articles.push(newArticle);
    }
  });
};

const fetchXmlAndUpdateState = (state, url) => loadData(state, url)
  .catch((error) => {
    state.watchedState.ui.errors.isUrlConnectionError = true;
    console.error('Ошибка при загрузке данных', error);
  })
  .then((data) => parseXml(state, data, url))
  .catch(() => {
    state.watchedState.ui.errors.isRssParseError = true;
  })
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
      watchedState.ui.isUrlProcessed = true;
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
