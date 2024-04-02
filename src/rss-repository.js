import onChange from 'on-change';
import initializeI18next from './i18n.js';
import { render } from './rss-controller.js';

const Status = {
  READY: 'Ready',
  PROCESS: 'Process',
  VALIDATION_ERROR: 'URL validation error',
  CONNECTION_ERROR: 'URL connection error',
  RSS_EXISTS_ERROR: 'RSS already exists',
  RSS_PARSE_ERROR: 'RSS parsing error',
  FINISHED: 'URL processed',
};

/**
 * Initializes the application state and returns
 * @returns {{ watchedState: StateType, domRefs: DomRefsType, i18n: Object }}
 */
const initState = () => {
  /**
   * @typedef {Object} ArticleType
   * @property {string} url - The URL of the article.
   * @property {string} title - The title of the article.
   * @property {string} summary - A summary of the article.
   * @property {string} id - Article id.
   * @property {string} feedId - Feed id.
   */

  /**
   * @typedef {Object} FeedType
   * @property {string} url - The URL of the feed.
   * @property {string} name - The name of the feed.
   * @property {string} description - A description of the feed.
   * @property {string} id - Feed id.
   */

  /**
   * @typedef {Object} ErrorsType
   * @property {boolean} isUrlValidationError - Indicates if there was a error with the URL.
   * @property {boolean} isUrlConnectionError - Indicates if there was a connection error.
   * @property {boolean} isRssExistsError - Indicates if the RSS feed exists.
   * @property {boolean} isRssParseError - Indicates if there was an error parsing the RSS feed.
   */

  /**
   * @typedef {Object} UIType
   * @property {Status} status - Specifies the status of the URL.
   * @property {string} urlInput - The current URL input value.
   * @property {Set<string>} readArticlesSet - A set of IDs for read articles.
   */

  /**
   * Represents the state of the application.
   * @typedef {Object} StateType
   * @property {Object} data - Data related to the application.
   * @property {FeedType[]} data.feeds - An array of feeds.
   * @property {ArticleType[]} data.articles - An array of articles.
   * @property {UIType} ui - UI state of the application.
   */
  const state = {
    data: {
      feeds: [],
      articles: [],
    },
    ui: {
      status: Status.READY,
      urlInput: '',
      readArticlesSet: new Set(),
    },
  };

  /**
   * Contains references to the DOM elements used in the application.
   * @typedef {Object} DomRefsType
   * @property {HTMLElement|null} mainTitle - The main title element.
   * @property {HTMLElement|null} mainSubtitle - The subtitle element.
   * @property {HTMLElement|null} mainPlaceholder - Placeholder element for main content.
   * @property {HTMLElement|null} mainExample - Example text element.
   * @property {HTMLElement|null} urlAddButton - Button for adding a new URL.
   * @property {HTMLElement|null} articleModal - Modal element for displaying articles.
   * @property {HTMLElement|null} articleModalRead - Button inside the modal to mark as read.
   * @property {HTMLElement|null} articleModalClose - Button to close the article modal.
   * @property {HTMLElement|null} articleModalTitle - Element where the title modal.
   * @property {HTMLElement|null} articleModalBody - Element for the body content in the modal.
   * @property {HTMLElement|null} urlInputField - Input field for entering the URL.
   * @property {HTMLElement|null} urlStatusDiv - Element to display the status of the URL.
   */
  const domRefs = {
    mainTitle: null,
    mainSubtitle: null,
    mainPlaceholder: null,
    mainExample: null,
    urlAddButton: null,
    articleModal: null,
    articleModalRead: null,
    articleModalClose: null,
    articleModalTitle: null,
    articleModalBody: null,
    urlInputField: null,
    urlStatusDiv: null,
  };

  const i18n = initializeI18next();

  const watchedState = onChange(state, () => {
    render({ watchedState, domRefs, i18n });
  });

  return { watchedState, domRefs, i18n };
};

export { initState, Status };
