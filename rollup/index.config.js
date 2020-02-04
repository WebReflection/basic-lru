import resolve from 'rollup-plugin-node-resolve';

export default {
  input: './esm/index.js',
  plugins: [
    
    resolve({module: true})
  ],
  
  output: {
    exports: 'named',
    file: './index.js',
    format: 'iife',
    name: 'LRU'
  }
};
