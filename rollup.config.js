import resolve from '@rollup/plugin-node-resolve';

import pkg from './package.json';

export default {
  input: 'src/index.js',
  plugins: [resolve()],
  external: ['path', '@rollup/plugin-inject'],
  output: [
    { format: 'cjs', file: pkg.main },
    { format: 'esm', file: pkg.module }
  ]
};
