module.exports = {
  env: {
    es2020: true,
    node: true,
  },
  extends: [
    'airbnb-base',
    'prettier',
    'plugin:import/typescript'
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 11,
    sourceType: 'module',
  },
  plugins: [
    '@typescript-eslint',
    "prettier",
  ],
  rules: {
    'prettier/prettier': 'error',
    "import/prefer-default-export": 'off',
    "import/extensions": "off",
    'class-methods-use-this': 'off',
    'no-param-reassign': 'off',
    'camelcase': 'off',
    'no-unused-vars': 'off',
    //'no-unused-vars': ['error', { argsIgnorePattern: 'next', varsIgnorePattern: 'Knex', }],
  },
  
};