import SoftLanding from './SoftLanding';
import { getUrlQueryParameter, getUrlQueryParameters } from './helpers';

// eslint-disable-next-line import/prefer-default-export
export const create = (...args) => new SoftLanding(...args);

export { getUrlQueryParameter, getUrlQueryParameters };
