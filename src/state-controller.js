import i18nInstance from './i18n.js';
import { addFeed, setArticleRead, verifyUrl } from './state-service.js';

let mainTitle;
let mainSubtitle;
let mainPlaceholder;
let mainExample;
let urlAddButton;
let articleModal;
let articleModalRead;
let articleModalClose;
let articleModalTitle;
let articleModalBody;
let urlInputField;
let urlStatusDiv;

const urlInputHandler = (event, state) => {
  verifyUrl(state, event.target.value);
};

const urlAddButtonHandler = (event, state) => {
  event.preventDefault();
  addFeed(state, urlInputField);
};

const openNewWindow = (_, currentModalUrl) => {
  if (currentModalUrl) {
    window.open(currentModalUrl, '_blank');
  }
};

const showModal = (event, state) => {
  const button = event.relatedTarget;
  const modalTitle = button.getAttribute('data-bs-title');
  const modalBody = button.getAttribute('data-bs-body');
  const articleId = button.getAttribute('data-id');
  const currentModalUrl = button.getAttribute('data-bs-url');

  articleModalTitle.textContent = modalTitle;
  articleModalBody.textContent = modalBody;

  setArticleRead(state, articleId);
  return currentModalUrl;
};

const createArticleListItem = (article, state) => {
  const articleLi = document.createElement('li');
  articleLi.classList.add('list-group-item', 'd-flex', 'justify-content-between', 'align-items-start', 'border-0', 'border-end-0');

  const a = document.createElement('a');
  a.classList.add(article.isRead ? 'fw-normal' : 'fw-bold');
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

  state.feeds.forEach((feed) => {
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
  if (state.urlValidateError) return i18nInstance.t('messages.urlValidateError');
  if (state.urlConnectionError) return i18nInstance.t('messages.urlConnectionError');
  if (state.rssParseError) return i18nInstance.t('messages.rssParseError');
  if (state.rssExistsError) return i18nInstance.t('messages.rssExistsError');
  return '';
};

/**
 * Renders the application state into the DOM.
 * @param {import('src/state-repository.js').state} state - The current state of the application.
 */
const render = (state) => {
  urlStatusDiv.innerHTML = '';
  urlInputField.classList.remove('is-invalid');

  if (!state.urlInput.length) {
    state.urlValidateError = false;
  }

  const errorMessage = getErrorMessage(state);
  if (errorMessage) {
    const paragraph = document.createElement('p');
    paragraph.textContent = errorMessage;
    paragraph.classList.add('feedback', 'm-0', 'position-absolute', 'small', 'text-danger');
    urlStatusDiv.appendChild(paragraph);
    state.urlSuccess = false;
    urlInputField.classList.add('is-invalid');
  }

  if (state.urlSuccess) {
    const paragraph = document.createElement('p');
    paragraph.textContent = i18nInstance.t('messages.rssLoaded');
    paragraph.classList.add('feedback', 'm-0', 'position-absolute', 'small', 'text-success');
    urlStatusDiv.appendChild(paragraph);
  }

  if (!state.feeds.length) {
    return;
  }

  renderFeedsAndArticles(state);
};

const setupUI = (state) => {
  let currentModalUrl = null;

  mainTitle.textContent = i18nInstance.t('ui.mainTitle');
  mainSubtitle.textContent = i18nInstance.t('ui.mainSubtitle');
  mainPlaceholder.textContent = i18nInstance.t('ui.mainPlaceholder');
  mainExample.textContent = i18nInstance.t('ui.mainExample');
  urlAddButton.textContent = i18nInstance.t('ui.urlAddButton');
  articleModalRead.textContent = i18nInstance.t('ui.readMore');
  articleModalClose.textContent = i18nInstance.t('ui.close');

  urlInputField.addEventListener('input', (event) => urlInputHandler(event, state));
  urlAddButton.addEventListener('click', (event) => urlAddButtonHandler(event, state));
  articleModalRead.addEventListener('click', (event) => openNewWindow(event, currentModalUrl));

  articleModal.addEventListener('show.bs.modal', (event) => {
    currentModalUrl = showModal(event, state);
  });

  articleModal.addEventListener('hidden.bs.modal', () => {
    currentModalUrl = null;
  });
};

const initialize = (state) => {
  document.addEventListener('DOMContentLoaded', () => {
    mainTitle = document.querySelector('#main-title');
    mainSubtitle = document.querySelector('#main-subtitle');
    mainPlaceholder = document.querySelector('#main-placeholder');
    mainExample = document.querySelector('#main-example');
    urlInputField = document.querySelector('#url-input');
    urlAddButton = document.querySelector('#add-button');
    urlStatusDiv = document.querySelector('#url-status');
    articleModal = document.querySelector('#articleModal');
    articleModalRead = document.querySelector('#articleModalRead');
    articleModalClose = document.querySelector('#articleModalClose');
    articleModalTitle = document.querySelector('.modal-title');
    articleModalBody = document.querySelector('.modal-body');

    setupUI(state);
  });
};

export { render, initialize };
