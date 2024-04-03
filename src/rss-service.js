import axios from 'axios';
import parseXml from './parser.js';
import getSchema from './schema.js';
import Status from './statusCodes.js';

const PROXY_URL = 'https://allorigins.hexlet.app/get';

const verifyUrl = (state, inputValue) => {
  const { watchedState } = state;
  watchedState.ui.urlInput = inputValue;
  if (!inputValue.length) {
    watchedState.ui.status = Status.READY;
    return;
  }

  getSchema(watchedState.data.feeds)
    .validate({
      url: watchedState.ui.urlInput,
      uniqueField: watchedState.ui.urlInput,
    })
    .then(() => {
      watchedState.ui.status = Status.READY;
      return true;
    })
    .catch(() => {
      watchedState.ui.status = Status.VALIDATION_ERROR;
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
    .catch(() => {
      throw new Error(Status.CONNECTION_ERROR);
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
  .then((data) => parseXml(state, data, url))
  .then((data) => updateState(state, data))
  .catch((error) => {
    if (error.message === Status.CONNECTION_ERROR) {
      console.error('Status.CONNECTION_ERROR');
      state.watchedState.ui.status = Status.CONNECTION_ERROR;
    } else if (error.message === Status.RSS_PARSE_ERROR) {
      console.error('Status.RSS_PARSE_ERROR');
      state.watchedState.ui.status = Status.RSS_PARSE_ERROR;
    } else {
      console.error(error);
    }
  });

const addFeed = (state) => {
  const { watchedState, domRefs } = state;
  watchedState.ui.status = Status.PROCESS;

  const existingFeed = watchedState.data.feeds
    .find((feed) => feed.url === watchedState.ui.urlInput);
  if (existingFeed) {
    watchedState.ui.status = Status.RSS_EXISTS_ERROR;
    return;
  }

  fetchXmlAndUpdateState(state, watchedState.ui.urlInput)
    .then(() => {
      domRefs.urlInputField.focus();

      if (watchedState.ui.status === Status.PROCESS) {
        watchedState.ui.urlInput = '';
        domRefs.urlInputField.value = '';
        watchedState.ui.status = Status.FINISHED;
      }
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
