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
          validUrl: 'The link must be a valid URL',
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
          validUrl: 'Ссылка должна быть валидной URL',
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
