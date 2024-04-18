const ruTranslations = {
  translation: {
    languages: {
      en: 'Английский',
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
      loading: 'Загрузка...',
    },
    messages: {
      isUrlValidationError: 'Ссылка должна быть валидным URL',
      isUrlConnectionError: 'Ошибка сети',
      isRssParseError: 'Ресурс не содержит валидный RSS',
      isRssExistsError: 'RSS уже существует',
      rssLoaded: 'RSS успешно загружен',
      schemaUrlRequired: 'Необходимо указать Url',
      schemaUrlExists: 'Url уже добавлен',
      schemaUrlUnique: 'Необходимо указать уникальное значение',
    },
    content: {
      posts: 'Посты',
      feeds: 'Фиды',
      view: 'Просмотр',
    },
  },
};

export default ruTranslations;
