import nextPlugin from '@next/eslint-plugin-next'
module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint', '@next/next'],
  extends: ['next/core-web-vitals', 'plugin:@typescript-eslint/recommended'],
  rules: {
...nextPlugin.configs.recommended.rules,
  },
}
