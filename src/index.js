import { initialize } from './stateController.js';
import { initState } from './stateRepository.js';

const state = initState();

state.feeds = [
  {
    url: 'https://example.com/feed1',
    name: 'Tech News',
    description: 'Latest technology news',
    id: 10,
    articles: [
      {
        url: 'https://example.com/article1',
        title: 'Interesting Article 1',
        summary: 'Summary of the first interesting article',
        readStatus: false,
        id: 100,
      },
      {
        url: 'https://example.com/article2',
        title: 'Interesting Article 2',
        summary: 'Summary of the second interesting article',
        readStatus: true,
        id: 101,
      },
    ],
  },
  {
    url: 'https://example.com/feed2',
    name: 'Science Daily',
    description: 'Daily science updates',
    id: 11,
    articles: [
      {
        url: 'https://example.com/article3',
        title: 'Interesting Article 3',
        summary: 'Summary of the third interesting article',
        readStatus: false,
        id: 102,
      },
    ],
  },
  {
    url: 'https://example.com/feed3',
    name: 'Sports Roundup',
    description: 'All about recent sports events',
    id: 12,
    articles: [],
  },
];

initialize(state);
