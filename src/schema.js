import * as Yup from 'yup';

const getSchema = (state) => {
  const { watchedState, i18n } = state;

  return Yup.object().shape({
    url: Yup.string().url().required(i18n.t('messages.schemaUrlRequired')),
    uniqueField: Yup.string()
      .notOneOf(watchedState.data.feeds, i18n.t('messages.schemaUrlExists'))
      .required(i18n.t('messages.schemaUrlUnique')),
  });
};

export default getSchema;
