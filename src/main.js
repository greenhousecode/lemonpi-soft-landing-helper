import { version as pkgversion } from '../package.json';
import SoftLanding from './SoftLanding';

export const version = pkgversion;
export const create = (...args) => new SoftLanding(...args);
