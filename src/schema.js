import * as Yup from 'yup';
import state from './state.js';

const getSchema = () => Yup.object().shape({
  url: Yup.string().url().required('Url is required'),
  uniqueField: Yup.string()
    .notOneOf(state.urls, 'Url exists in list')
    .required('Unique field is required'),
});

export default getSchema;
