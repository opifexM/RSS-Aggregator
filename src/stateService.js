import getSchema from './schema.js';
import { urlInputField } from './stateDom.js';

function verifyUrl(state, inputValue) {
  state.urlInput = inputValue;
  getSchema(state.feeds)
    .validate({ url: state.urlInput, uniqueField: state.urlInput })
    .then(() => state.urlError = false)
    .catch(() => state.urlError = true);
}

function addUrl(state) {
  if (state.urlError) {
    return;
  }

  state.feeds.push(state.urlInput);
  state.urlInput = '';
  urlInputField.value = '';
  state.urlSuccess = true;
  urlInputField.focus();
}

export { verifyUrl, addUrl };
