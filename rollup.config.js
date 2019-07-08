import { eslint } from 'rollup-plugin-eslint';
import { uglify } from 'rollup-plugin-uglify';
import babel from 'rollup-plugin-babel';
import moment from 'moment';
import { name, version, main, module } from './package.json';

const input = 'src/main.js';
const banner = `/*! ${name} v${version} ${moment().format('YYYY/MM/DD')} */`;

export default [
  {
    input,
    plugins: [
      // Workaround: ignore global .eslintrc files
      eslint({ useEslintrc: false, configFile: '.eslintrc' }),
      babel(),
      uglify({ output: { comments: /^!/ } }),
    ],
    output: {
      banner,
      file: main,
      format: 'umd',
      name: 'lemonpiSoftLandingHelper',
    },
  },
  {
    input,
    output: {
      banner,
      file: module,
      format: 'esm',
    },
  },
];
