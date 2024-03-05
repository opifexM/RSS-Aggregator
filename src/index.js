import onChange from 'on-change';
import state from './state.js';
import { render, urlAddButtonHandler, verifyUrl } from './view.js';

const urlInputField = document.querySelector('#url-input');
const urlAddButton = document.querySelector('#add-button');

const watchedState = onChange(state, () => {
  render(watchedState);
});

urlInputField.addEventListener('input', (event) => verifyUrl(event, watchedState));
urlAddButton.addEventListener('click', () => urlAddButtonHandler(watchedState));

render(watchedState);
