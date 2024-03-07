import i18next from 'i18next';

function initializeI18next() {
  i18next.init({
    lng: 'ru',
    debug: false,
    resources: {
      en: {
        translation: {
          mainTitle: 'RSS Aggregator',
          mainSubtitle: 'Enter the address to read RSS',
          mainPlaceholder: 'RSS Link',
          mainExample: 'Example: https://lorem-rss.hexlet.app/feed',
          urlAddButton: 'Add',
          readMore: 'Read more',
          close: 'Close',
          urlError: 'The link must be a valid URL',
          rssError: 'The resource does not contain valid RSS',
          rssLoaded: 'RSS successfully loaded',
          posts: 'Posts',
          feeds: 'Feeds',
          view: 'View',
        },
      },
      ru: {
        translation: {
          mainTitle: 'RSS агрегатор',
          mainSubtitle: 'Введите адрес для чтения RSS',
          mainPlaceholder: 'RSS Ссылка',
          mainExample: 'Пример: https://lorem-rss.hexlet.app/feed',
          urlAddButton: 'Добавить',
          readMore: 'Читать полностью',
          close: 'Закрыть',
          urlError: 'Ссылка должна быть валидной URL',
          rssError: 'Ресурс не содержит валидный RSS\n',
          rssLoaded: 'RSS успешно загружен',
          posts: 'Посты',
          feeds: 'Фиды',
          view: 'Просмотр',
        },
      },
    },
  });
}

export default initializeI18next;
