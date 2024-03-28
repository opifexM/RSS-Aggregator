import i18nInstance from './i18n.js';
import { addFeed, setArticleRead, verifyUrl } from './rss-service.js';

const urlInputHandler = (event, state) => {
  verifyUrl(state, event.target.value);
};

function showLoading() {
  const articleDiv = document.querySelector('#article-div');
  articleDiv.innerHTML = '';
  const p = document.createElement('p');
  p.textContent = i18nInstance.t('ui.loading');
  articleDiv.appendChild(p);
}

const urlAddButtonHandler = (event, state) => {
  event.preventDefault();

  if (state.ui.errors.isUrlValidationError) {
    return;
  }
  showLoading();
  addFeed(state, state.domRefs.urlInputField);
};

const openNewWindow = (_, currentModalUrl) => {
  if (currentModalUrl) {
    window.open(currentModalUrl, '_blank');
  }
};

const updateModalContent = (event, state) => {
  const button = event.relatedTarget;
  const modalTitle = button.getAttribute('data-bs-title');
  const modalBody = button.getAttribute('data-bs-body');
  const articleId = button.getAttribute('data-id');
  const currentModalUrl = button.getAttribute('data-bs-url');

  state.domRefs.articleModalTitle.textContent = modalTitle;
  state.domRefs.articleModalBody.textContent = modalBody;

  setArticleRead(state, articleId);
  return currentModalUrl;
};

const createArticleListItem = (article, state) => {
  const articleLi = document.createElement('li');
  articleLi.classList.add('list-group-item', 'd-flex', 'justify-content-between', 'align-items-start', 'border-0', 'border-end-0');

  const a = document.createElement('a');
  a.classList.add(state.ui.readArticlesSet.has(article.id) ? 'fw-normal' : 'fw-bold');
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
  button.textContent = i18nInstance.t('content.view');
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

const renderFeedsAndArticles = (state) => {
  const articleDiv = document.querySelector('#article-div');
  articleDiv.innerHTML = '';
  const articleCard = document.createElement('div');
  articleCard.classList.add('card-body');
  const articleCardH2 = document.createElement('h2');
  articleCardH2.classList.add('card-title', 'h4');
  articleCardH2.textContent = i18nInstance.t('content.posts');
  articleCard.appendChild(articleCardH2);
  articleDiv.appendChild(articleCard);

  const articleList = document.createElement('ul');
  articleList.classList.add('list-group', 'border-0', 'rounded-0');
  articleDiv.appendChild(articleList);

  const feedDiv = document.querySelector('#feed-div');
  feedDiv.innerHTML = '';
  const feedCard = document.createElement('div');
  feedCard.classList.add('card-body');
  const feedCardH2 = document.createElement('h2');
  feedCardH2.classList.add('card-title', 'h4');
  feedCardH2.textContent = i18nInstance.t('content.feeds');
  feedCard.appendChild(feedCardH2);
  feedDiv.appendChild(feedCard);

  const feedList = document.createElement('ul');
  feedList.classList.add('list-group', 'border-0', 'rounded-0');
  feedDiv.appendChild(feedList);

  state.data.feeds.forEach((feed) => {
    const li = createFeedListItem(feed);
    feedList.appendChild(li);

    if (!feed.articles.length) {
      return;
    }

    feed.articles.forEach((article) => {
      const articleLi = createArticleListItem(article, state);
      articleList.appendChild(articleLi);
    });
  });
};

const getErrorMessage = (state) => {
  if (state.ui.errors.isUrlValidationError) return i18nInstance.t('messages.isUrlValidationError');
  if (state.ui.errors.isUrlConnectionError) return i18nInstance.t('messages.isUrlConnectionError');
  if (state.ui.errors.isRssParseError) return i18nInstance.t('messages.isRssParseError');
  if (state.ui.errors.isRssExistsError) return i18nInstance.t('messages.isRssExistsError');
  return '';
};

/**
 * @param {import('src/rss-repository.js').state} state
 */
const render = (state) => {
  if (!state.ui.initialize) {
    return;
  }

  console.log('render');
  state.domRefs.urlStatusDiv.innerHTML = '';
  state.domRefs.urlInputField.classList.remove('is-invalid');

  if (!state.ui.urlInput.length) {
    state.ui.errors.isUrlValidationError = false;
  }

  const errorMessage = getErrorMessage(state);
  if (errorMessage) {
    const paragraph = document.createElement('p');
    paragraph.textContent = errorMessage;
    paragraph.classList.add('feedback', 'm-0', 'position-absolute', 'small', 'text-danger');
    state.domRefs.urlStatusDiv.appendChild(paragraph);
    state.ui.urlSuccess = false;
    state.domRefs.urlInputField.classList.add('is-invalid');
  }

  if (state.ui.urlSuccess) {
    const paragraph = document.createElement('p');
    paragraph.textContent = i18nInstance.t('messages.rssLoaded');
    paragraph.classList.add('feedback', 'm-0', 'position-absolute', 'small', 'text-success');
    state.domRefs.urlStatusDiv.appendChild(paragraph);
  }

  if (!state.data.feeds.length) {
    return;
  }

  renderFeedsAndArticles(state);
};

const setupUI = (state) => {
  let currentModalUrl = null;

  state.domRefs.mainTitle.textContent = i18nInstance.t('ui.mainTitle');
  state.domRefs.mainSubtitle.textContent = i18nInstance.t('ui.mainSubtitle');
  state.domRefs.mainPlaceholder.textContent = i18nInstance.t('ui.mainPlaceholder');
  state.domRefs.mainExample.textContent = i18nInstance.t('ui.mainExample');
  state.domRefs.urlAddButton.textContent = i18nInstance.t('ui.urlAddButton');
  state.domRefs.articleModalRead.textContent = i18nInstance.t('ui.readMore');
  state.domRefs.articleModalClose.textContent = i18nInstance.t('ui.close');

  state.domRefs.urlInputField.addEventListener('input', (event) => urlInputHandler(event, state));
  state.domRefs.urlAddButton.addEventListener('click', (event) => urlAddButtonHandler(event, state));
  state.domRefs.articleModalRead.addEventListener('click', (event) => openNewWindow(event, currentModalUrl));

  state.domRefs.articleModal.addEventListener('show.bs.modal', (event) => {
    currentModalUrl = updateModalContent(event, state);
  });

  state.domRefs.articleModal.addEventListener('hidden.bs.modal', () => {
    currentModalUrl = null;
  });
};

const initialize = (state) => {
  console.log('initialize');
  document.addEventListener('DOMContentLoaded', () => {
    console.log('1');
    state.domRefs.mainTitle = document.querySelector('#main-title');
    console.log('2');
    state.domRefs.mainSubtitle = document.querySelector('#main-subtitle');
    state.domRefs.mainPlaceholder = document.querySelector('#main-placeholder');
    state.domRefs.mainExample = document.querySelector('#main-example');
    state.domRefs.urlInputField = document.querySelector('#url-input');
    state.domRefs.urlAddButton = document.querySelector('#add-button');
    state.domRefs.urlStatusDiv = document.querySelector('#url-status');
    state.domRefs.articleModal = document.querySelector('#articleModal');
    state.domRefs.articleModalRead = document.querySelector('#articleModalRead');
    state.domRefs.articleModalClose = document.querySelector('#articleModalClose');
    state.domRefs.articleModalTitle = document.querySelector('.modal-title');
    state.domRefs.articleModalBody = document.querySelector('.modal-body');

    console.log(state);
    setupUI(state);
    state.ui.initialize = true;
  });
};

export { render, initialize };
