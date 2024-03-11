import { initialize } from './controller/rss-controller.js';
import { initState } from './repository/rss-repository.js';
import { scheduleFeedUpdates } from './service/rss-service.js';

const FEED_UPDATE_INTERVAL_MS = 5000;

const initializeApp = () => {
  const state = initState();

  initialize(state);
  scheduleFeedUpdates(state, FEED_UPDATE_INTERVAL_MS);
};

export default initializeApp;
