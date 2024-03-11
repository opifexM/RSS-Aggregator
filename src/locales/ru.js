const ruTranslations = {
  translation: {
    languages: {
      en: 'English',
      ru: 'Русский',
    },
    ui: {
      mainTitle: 'RSS агрегатор',
      mainSubtitle: 'Введите адрес для чтения RSS',
      mainPlaceholder: 'RSS Ссылка',
      mainExample: 'Пример: https://lorem-rss.hexlet.app/feed',
      urlAddButton: 'Добавить',
      readMore: 'Читать полностью',
      close: 'Закрыть',
    },
    messages: {
      urlValidateError: 'Ссылка должна быть валидным URL',
      urlConnectionError: 'Ошибка сети',
      rssParseError: 'Ресурс не содержит валидный RSS',
      rssExistsError: 'RSS уже существует',
      rssLoaded: 'RSS успешно загружен',
    },
    content: {
      posts: 'Посты',
      feeds: 'Фиды',
      view: 'Просмотр',
    },
  },
};

export default ruTranslations;
