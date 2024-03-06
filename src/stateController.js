import {
  articleModal, articleModalBody,
  articleModalClose,
  articleModalRead, articleModalTitle,
  urlAddButton,
  urlInputField,
  urlStatusDiv,
} from './stateDom.js';
import { addUrl, verifyUrl } from './stateService.js';

function urlInputHandler(event, state) {
  verifyUrl(state, event.target.value);
}

function urlAddButtonHandler(state) {
  addUrl(state);
}

function openNewWindow(_, currentModalUrl) {
  if (currentModalUrl) {
    window.open(currentModalUrl, '_blank');
  }
}

function initialize(state) {
  let currentModalUrl = null;

  articleModalRead.textContent = 'Читать полностью';
  articleModalClose.textContent = 'Закрыть';

  urlInputField.addEventListener('input', (event) => urlInputHandler(event, state));
  urlAddButton.addEventListener('click', () => urlAddButtonHandler(state));
  articleModalRead.addEventListener('click', (event) => openNewWindow(event, currentModalUrl));

  articleModal.addEventListener('show.bs.modal', (event) => {
    const button = event.relatedTarget;
    const modalTitle = button.getAttribute('data-bs-title');
    const modalBody = button.getAttribute('data-bs-body');
    currentModalUrl = button.getAttribute('data-bs-url');

    articleModalTitle.textContent = modalTitle;
    articleModalBody.textContent = modalBody;
  });

  articleModal.addEventListener('hidden.bs.modal', () => {
    currentModalUrl = null;
  });
}


/**
 * Renders the application state into the DOM.
 * @param {import('src/stateRepository.js').state} state - The current state of the application.
 */
function render(state) {
  console.log(state);

  urlStatusDiv.innerHTML = '';
  urlAddButton.disabled = !state.urlInput.length;
  urlInputField.classList.remove('is-invalid');

  if (!state.urlInput.length) {
    state.urlSuccess = false;
    state.urlError = false;
  }

  if (state.urlError) {
    const paragraph = document.createElement('p');
    paragraph.textContent = 'The link must be a valid URL';
    paragraph.classList.add('feedback', 'm-0', 'position-absolute', 'small', 'text-danger');
    urlStatusDiv.appendChild(paragraph);
    urlAddButton.disabled = true;
    state.urlSuccess = false;
    urlInputField.classList.add('is-invalid');
  }

  if (state.urlSuccess) {
    const paragraph = document.createElement('p');
    paragraph.textContent = 'RSS successfully loaded';
    paragraph.classList.add('feedback', 'm-0', 'position-absolute', 'small', 'text-success');
    urlStatusDiv.appendChild(paragraph);
  }

  if (!state.feeds.length) {
    return;
  }

  const articleDiv = document.querySelector('#article-div');
  articleDiv.innerHTML = '';
  const articleCard = document.createElement('div');
  articleCard.classList.add('card-body');
  const articleCardH2 = document.createElement('h2');
  articleCardH2.classList.add('card-title', 'h4');
  articleCardH2.textContent = 'Посты';
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
  feedCardH2.textContent = 'Фиды';
  feedCard.appendChild(feedCardH2);
  feedDiv.appendChild(feedCard);

  const feedList = document.createElement('ul');
  feedList.classList.add('list-group', 'border-0', 'rounded-0');
  feedDiv.appendChild(feedList);

  state.feeds.forEach((feed) => {
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
    feedList.appendChild(li);

    if (!feed.articles.length) {
      return;
    }

    feed.articles.forEach((article) => {
      const articleLi = document.createElement('li');
      articleLi.classList.add('list-group-item', 'd-flex', 'justify-content-between', 'align-items-start', 'border-0', 'border-end-0');

      const a = document.createElement('a');
      a.classList.add('fw-bold');
      a.dataset.id = article.id;
      a.href = article.url;
      a.target = '_blank';
      a.rel = 'noopener noreferrer';
      a.textContent = article.title;
      articleLi.appendChild(a);

      const button = document.createElement('button');
      button.classList.add('btn', 'btn-outline-primary', 'btn-sm');
      button.dataset.id = article.id;
      button.dataset.bsToggle = 'modal';
      button.dataset.bsTarget = '#articleModal';
      button.dataset.bsTitle = article.title;
      button.dataset.bsBody = article.summary;
      button.dataset.bsUrl = article.url;
      button.type = 'button';
      button.textContent = 'Просмотр';
      articleLi.appendChild(button);

      articleList.appendChild(articleLi);
    });
  });
}

export { render, initialize };