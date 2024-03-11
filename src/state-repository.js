import onChange from 'on-change';
import { render } from './state-controller.js';

function initState() {
  /**
   * @typedef {Object} ArticleType
   * @property {string} url - The URL of the article.
   * @property {string} title - The title of the article.
   * @property {string} summary - A summary of the article.
   * @property {boolean} isRead - Whether the article has been read.
   * @property {string} id - article id.
   */

  /**
   * @typedef {Object} FeedType
   * @property {string} url - The URL of the feed.
   * @property {string} name - The name of the feed.
   * @property {string} description - A description of the feed.
   * @property {string} id - feed id.
   * @property {ArticleType[]} articles - An array of articles.
   */

  /**
   * Represents the state of the application.
   * @type {Object}
   * @property {boolean} urlValidateError - Indicates if there was a validation error with the URL.
   * @property {boolean} urlConnectionError - Indicates if there was a connection error.
   * @property {boolean} rssExistsError - Indicates if the RSS feed exists.
   * @property {boolean} rssParseError - Indicates if there was an error parsing the RSS feed.
   * @property {boolean} urlSuccess - Indicates if the URL was processed successfully.
   * @property {string} urlInput - The current URL input value.
   * @property {FeedType[]} feeds - An array of feeds.
   */
  const state = {
    urlValidateError: false,
    urlConnectionError: false,
    rssExistsError: false,
    rssParseError: false,
    urlSuccess: false,
    urlInput: '',
    feeds: [],
  };

  const watchedState = onChange(state, () => {
    render(watchedState);
  });

  return watchedState;
}

function isWatchedByOnChange(object) {
  return !!object.$$typeofOnChange;
}

export { initState, isWatchedByOnChange };
