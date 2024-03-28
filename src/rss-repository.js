import onChange from 'on-change';
import {render} from './rss-controller.js';

const initState = () => {
  /**
   * @typedef {Object} ArticleType
   * @property {string} url - The URL of the article.
   * @property {string} title - The title of the article.
   * @property {string} summary - A summary of the article.
   * @property {string} id - Article id.
   */

  /**
   * @typedef {Object} FeedType
   * @property {string} url - The URL of the feed.
   * @property {string} name - The name of the feed.
   * @property {string} description - A description of the feed.
   * @property {string} id - Feed id.
   * @property {ArticleType[]} articles - An array of articles.
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
   * @property {ErrorsType} errors - Object containing error states.
   * @property {boolean} isUrlSuccess - Indicates if the URL was processed successfully.
   * @property {string} urlInput - The current URL input value.
   * @property {Set<string>} readArticlesSet - A set of IDs for read articles.
   */

  /**
   * Represents the state of the application.
   * @typedef {Object} StateType
   * @property {Object} data - Data related to the application.
   * @property {FeedType[]} data.feeds - An array of feeds.
   * @property {UIType} ui - UI state of the application.
   */
  const state = {
    data: {
      feeds: [],
    },
    ui: {
      errors: {
        isUrlValidationError: false,
        isUrlConnectionError: false,
        isRssExistsError: false,
        isRssParseError: false,
      },
      urlSuccess: false,
      urlInput: '',
      readArticlesSet: new Set(),
      initialize: false,
    },
    domRefs: {
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
    },
  };

  const watchedState = onChange(state, () => {
    render(watchedState);
  });

  return watchedState;
};

const isWatchedByOnChange = (object) => !!object.$$typeofOnChange;

export { initState, isWatchedByOnChange };
