import resolve from 'rollup-plugin-node-resolve';
import { terser } from 'rollup-plugin-terser';
import babel from 'rollup-plugin-babel';
import json from 'rollup-plugin-json';
import moment from 'moment';
import { name, version } from './package.json';

const banner = `/*! ${name} v${version} ${moment().format('YYYY/MM/DD')} */`;

export default [
  {
    input: 'src/main.js',
    plugins: [resolve(), json(), babel(), terser({ output: { comments: /^!/ } })],
    output: {
      banner,
      file: 'dist/bundle.umd.js',
      format: 'umd',
      name: 'lemonpiSoftLandingHelper',
    },
  },
  {
    input: 'src/main.js',
    plugins: [resolve(), json()],
    output: {
      banner,
      file: 'dist/bundle.esm.js',
      format: 'esm',
    },
  },
];
