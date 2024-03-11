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
    },
    messages: {
      urlValidateError: 'The link must be a valid URL',
      urlConnectionError: 'Network error',
      rssParseError: 'The resource does not contain valid RSS',
      rssExistsError: 'RSS exists',
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
