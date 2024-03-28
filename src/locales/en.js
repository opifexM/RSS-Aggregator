const enTranslations = {
  translation: {
    languages: {
      en: 'English',
      ru: 'Русский',
    },
    ui: {
      mainTitle: 'RSS Aggregator',
      mainSubtitle: 'Enter the address to read RSS',
      mainPlaceholder: 'RSS Link',
      mainExample: 'Example: https://lorem-rss.hexlet.app/feed',
      urlAddButton: 'Add',
      readMore: 'Read more',
      close: 'Close',
      loading: 'Loading...',
    },
    messages: {
      isUrlValidationError: 'The link must be a valid URL',
      isUrlConnectionError: 'Network error',
      isRssParseError: 'The resource does not contain valid RSS',
      isRssExistsError: 'RSS exists',
      rssLoaded: 'RSS successfully loaded',
    },
    content: {
      posts: 'Posts',
      feeds: 'Feeds',
      view: 'View',
    },
  },
};

export default enTranslations;
