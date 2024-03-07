import initializeI18next from './i18n.js';
import { initialize } from './state-controller.js';
import { initState } from './state-repository.js';
import { scheduleFeedUpdates } from './state-service.js';

const FEED_UPDATE_INTERVAL_MS = 5000;

initializeI18next();
const state = initState();

initialize(state);
scheduleFeedUpdates(state, FEED_UPDATE_INTERVAL_MS);
