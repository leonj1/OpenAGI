export default {
  presets: [
    ['@babel/preset-env', { modules: false }],
    '@babel/preset-typescript',
    ['@babel/preset-react', { runtime: 'automatic' }]
  ],
  ignore: [
    'node_modules',
    'dist',
    '**/*.d.ts'
  ]
}; 