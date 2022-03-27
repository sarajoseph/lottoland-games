module.exports = {
  env: {
    browser: true,
    es2021: true,
    node: true
  },
  extends: [
    'standard'
  ],
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module'
  },
  rules: {
		'eol-last': ['error', 'never'],
    'indent': ['error', 'tab'],
    'quotes': ['error', 'single'],
    'semi': ['error', 'always']
  }
}
