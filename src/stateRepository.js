import onChange from 'on-change';
import { render } from './stateController.js';

export const initState = () => {
  /**
   * @typedef {Object} ArticleType
   * @property {string} url - The URL of the article.
   * @property {string} title - The title of the article.
   * @property {string} summary - A summary of the article.
   * @property {boolean} readStatus - Whether the article has been read.
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
   * @property {boolean} urlError - Indicates if there was an error with the URL.
   * @property {boolean} urlSuccess - Indicates if the URL was processed successfully.
   * @property {string} urlInput - The current URL input value.
   * @property {FeedType[]} feeds - An array of feeds.
   */
  const state = {
    urlError: false,
    urlSuccess: false,
    urlInput: '',
    feeds: [],
  };

  const watchedState = onChange(state, () => {
    render(watchedState);
  });

  return watchedState;
};
