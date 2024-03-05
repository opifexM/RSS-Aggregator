import getSchema from "./schema.js";

function render(state) {
  console.log(state);
  console.log(state.urls);
  const urlStatusDiv = document.querySelector('#url-status');
  const urlAddButton = document.querySelector('#add-button');

  urlStatusDiv.innerHTML = '';
  urlAddButton.disabled = !state.urlInput.length;

  if (state.urlError) {
    const paragraph = document.createElement('p');
    paragraph.textContent = 'The link must be a valid URL';
    paragraph.classList.add('feedback', 'm-0', 'position-absolute', 'small', 'text-danger');
    urlStatusDiv.appendChild(paragraph);
    urlAddButton.disabled = true;
    state.urlSuccess = false;
  }

  if (state.urlSuccess) {
    const paragraph = document.createElement('p');
    paragraph.textContent = 'RSS successfully loaded';
    paragraph.classList.add('feedback', 'm-0', 'position-absolute', 'small', 'text-success');
    urlStatusDiv.appendChild(paragraph);
  }
}

function urlAddButtonHandler(state) {
  if (state.urlError) {
    return;
  }

  const urlInputField = document.querySelector('#url-input');
  state.urls.push(state.urlInput);
  state.urlInput = '';
  urlInputField.value = '';
  state.urlSuccess = true;
}

function verifyUrl(event, state) {
  state.urlInput = event.target.value;
  getSchema()
    .validate({ url: state.urlInput, uniqueField: state.urlInput })
    .then(() => state.urlError = false)
    .catch(() => state.urlError = true);
}

export { render, verifyUrl, urlAddButtonHandler };
