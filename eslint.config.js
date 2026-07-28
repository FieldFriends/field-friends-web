import vuetify from 'eslint-config-vuetify';

export default [
  ...vuetify,
  {
    rules: {
      'semi': 'off',
      '@stylistic/semi': ['error', 'always'],
      'vue/script-indent': ['error', 0, {
        baseIndent: 0,
      }],
    },
  },
];