import * as Yup from 'yup';

const getSchema = (feedUrlList) => Yup.object().shape({
  url: Yup.string().url().required('Url is required'),
  uniqueField: Yup.string()
    .notOneOf(feedUrlList, 'Url exists in list')
    .required('Unique field is required'),
});

export default getSchema;
