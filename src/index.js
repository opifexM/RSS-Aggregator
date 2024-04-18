import { initializeDOM } from './rss-view.js';
import { initState } from './rss-repository.js';
import { scheduleFeedUpdates } from './rss-service.js';

const FEED_UPDATE_INTERVAL_MS = 5000;

const index = () => {
  const state = initState();

  initializeDOM(state);
  scheduleFeedUpdates(state, FEED_UPDATE_INTERVAL_MS);
};

index();
