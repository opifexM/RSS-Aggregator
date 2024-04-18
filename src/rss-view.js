import { addFeed, setArticleRead, verifyUrl } from './rss-service.js';
import Status from './statusCodes.js';

const urlInputHandler = (event, state) => {
  verifyUrl(state, event.target.value);
};

const urlAddButtonHandler = (event, state) => {
  const { watchedState } = state;

  if (!watchedState.ui.urlInput.length) {
    return;
  }
  event.preventDefault();

  if (watchedState.ui.status === Status.VALIDATION_ERROR
    || watchedState.ui.status === Status.PROCESS) {
    return;
  }

  addFeed(state);
};

const openNewWindow = (_, currentModalUrl) => {
  if (currentModalUrl) {
    window.open(currentModalUrl, '_blank');
  }
};

const updateModalContent = (event, state) => {
  const { domRefs } = state;
  const button = event.relatedTarget;
  const modalTitle = button.getAttribute('data-bs-title');
  const modalBody = button.getAttribute('data-bs-body');
  const articleId = button.getAttribute('data-id');
  const currentModalUrl = button.getAttribute('data-bs-url');

  domRefs.articleModalTitle.textContent = modalTitle;
  domRefs.articleModalBody.textContent = modalBody;

  setArticleRead(state, articleId);
  return currentModalUrl;
};

const createArticleListItem = (article, state) => {
  const { watchedState, i18n } = state;
  const articleLi = document.createElement('li');
  articleLi.classList.add('list-group-item', 'd-flex', 'justify-content-between', 'align-items-start', 'border-0', 'border-end-0');

  const a = document.createElement('a');
  a.classList.add(watchedState.ui.readArticlesSet.has(article.id) ? 'fw-normal' : 'fw-bold');
  a.dataset.id = article.id;
  a.href = article.url;
  a.target = '_blank';
  a.rel = 'noopener noreferrer';
  a.textContent = article.title;
  articleLi.appendChild(a);
  a.addEventListener('click', () => setArticleRead(state, article.id));

  const button = document.createElement('button');
  button.classList.add('btn', 'btn-outline-primary', 'btn-sm');
  button.dataset.id = article.id;
  button.dataset.bsToggle = 'modal';
  button.dataset.bsTarget = '#articleModal';
  button.dataset.bsTitle = article.title;
  button.dataset.bsBody = article.summary;
  button.dataset.bsUrl = article.url;
  button.type = 'button';
  button.textContent = i18n.t('content.view');
  articleLi.appendChild(button);
  return articleLi;
};

const createFeedListItem = (feed) => {
  const li = document.createElement('li');
  li.classList.add('list-group-item', 'border-0', 'border-end-0');

  const h3 = document.createElement('h3');
  h3.classList.add('h6', 'm-0');
  h3.textContent = feed.name;
  li.appendChild(h3);

  const p = document.createElement('p');
  p.classList.add('m-0', 'small', 'text-black-50');
  p.textContent = feed.description;
  li.appendChild(p);
  return li;
};

function renderFeedsAndArticles(i18n, watchedState, state, articleList) {
  const feedsFragment = new DocumentFragment();
  const feedCard = document.createElement('div');
  feedCard.classList.add('card-body');
  const feedCardH2 = document.createElement('h2');
  feedCardH2.classList.add('card-title', 'h4');
  feedCardH2.textContent = i18n.t('content.feeds');
  feedCard.appendChild(feedCardH2);
  feedsFragment.appendChild(feedCard);

  const feedList = document.createElement('ul');
  feedList.classList.add('list-group', 'border-0', 'rounded-0');
  feedsFragment.appendChild(feedList);

  watchedState.data.feeds.forEach((feed) => {
    const li = createFeedListItem(feed);
    feedList.appendChild(li);

    const articles = watchedState.data.articles.filter((article) => article.feedId === feed.id);
    if (!articles.length) {
      return;
    }

    articles.forEach((article) => {
      const articleLi = createArticleListItem(article, state);
      articleList.appendChild(articleLi);
    });
  });

  const feedDiv = document.querySelector('#feed-div');
  feedDiv.innerHTML = '';
  feedDiv.appendChild(feedsFragment);
}

const renderUI = (state) => {
  const { watchedState, i18n } = state;

  const articleFragment = new DocumentFragment();
  const articleCard = document.createElement('div');
  articleCard.classList.add('card-body');
  const articleCardH2 = document.createElement('h2');
  articleCardH2.classList.add('card-title', 'h4');
  articleCardH2.textContent = i18n.t('content.posts');
  articleCard.appendChild(articleCardH2);
  articleFragment.appendChild(articleCard);

  const articleList = document.createElement('ul');
  articleList.classList.add('list-group', 'border-0', 'rounded-0');
  articleFragment.appendChild(articleList);

  const articleDiv = document.querySelector('#article-div');
  articleDiv.innerHTML = '';
  articleDiv.appendChild(articleFragment);

  renderFeedsAndArticles(i18n, watchedState, state, articleList);
};

const getErrorMessage = (state) => {
  const { watchedState, i18n } = state;
  switch (watchedState.ui.status) {
    case Status.VALIDATION_ERROR:
      return i18n.t('messages.isUrlValidationError');
    case Status.CONNECTION_ERROR:
      return i18n.t('messages.isUrlConnectionError');
    case Status.RSS_PARSE_ERROR:
      return i18n.t('messages.isRssParseError');
    case Status.RSS_EXISTS_ERROR:
      return i18n.t('messages.isRssExistsError');
    default:
      return '';
  }
};

const updateStatusMessage = (state) => {
  const { watchedState, domRefs, i18n } = state;
  domRefs.urlStatusDiv.innerHTML = '';
  domRefs.urlInputField.classList.remove('is-invalid');

  let message = '';
  let cssClass = '';

  switch (watchedState.ui.status) {
    case Status.VALIDATION_ERROR:
    case Status.CONNECTION_ERROR:
    case Status.RSS_EXISTS_ERROR:
    case Status.RSS_PARSE_ERROR:
      message = getErrorMessage(state);
      cssClass = 'text-danger';
      domRefs.urlInputField.classList.add('is-invalid');
      break;
    case Status.FINISHED:
      message = i18n.t('messages.rssLoaded');
      cssClass = 'text-success';
      break;
    case Status.PROCESS:
      message = i18n.t('ui.loading');
      cssClass = 'text-warning';
      break;
    default:
      break;
  }

  if (message) {
    const paragraph = document.createElement('p');
    paragraph.textContent = message;
    paragraph.classList.add('feedback', 'm-0', 'position-absolute', 'small', cssClass);
    domRefs.urlStatusDiv.appendChild(paragraph);
  }
};

const renderFeeds = (state) => {
  if (state.watchedState.data.feeds.length > 0) {
    renderUI(state);
  }
};

/**
 * @param {import('src/rss-repository.js').initState} state
 */
const render = (state) => {
  updateStatusMessage(state);
  renderFeeds(state);
};

const setupUI = (state) => {
  const { domRefs, i18n } = state;
  let currentModalUrl = null;

  domRefs.mainTitle.textContent = i18n.t('ui.mainTitle');
  domRefs.mainSubtitle.textContent = i18n.t('ui.mainSubtitle');
  domRefs.mainPlaceholder.textContent = i18n.t('ui.mainPlaceholder');
  domRefs.mainExample.textContent = i18n.t('ui.mainExample');
  domRefs.urlAddButton.textContent = i18n.t('ui.urlAddButton');
  domRefs.articleModalRead.textContent = i18n.t('ui.readMore');
  domRefs.articleModalClose.textContent = i18n.t('ui.close');

  domRefs.urlInputField.addEventListener('input', (event) => urlInputHandler(event, state));
  domRefs.urlAddButton.addEventListener('click', (event) => urlAddButtonHandler(event, state));
  domRefs.articleModalRead.addEventListener('click', (event) => openNewWindow(event, currentModalUrl));

  domRefs.articleModal.addEventListener('show.bs.modal', (event) => {
    currentModalUrl = updateModalContent(event, state);
  });

  domRefs.articleModal.addEventListener('hidden.bs.modal', () => {
    currentModalUrl = null;
  });
};

const initializeDOM = (state) => {
  const { domRefs } = state;
  document.addEventListener('DOMContentLoaded', () => {
    domRefs.mainTitle = document.querySelector('#main-title');
    domRefs.mainSubtitle = document.querySelector('#main-subtitle');
    domRefs.mainPlaceholder = document.querySelector('#main-placeholder');
    domRefs.mainExample = document.querySelector('#main-example');
    domRefs.urlInputField = document.querySelector('#url-input');
    domRefs.urlAddButton = document.querySelector('#add-button');
    domRefs.urlStatusDiv = document.querySelector('#url-status');
    domRefs.articleModal = document.querySelector('#articleModal');
    domRefs.articleModalRead = document.querySelector('#articleModalRead');
    domRefs.articleModalClose = document.querySelector('#articleModalClose');
    domRefs.articleModalTitle = document.querySelector('.modal-title');
    domRefs.articleModalBody = document.querySelector('.modal-body');

    setupUI(state);
  });
};

export { render, initializeDOM };
