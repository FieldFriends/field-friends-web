import vuetify from 'eslint-config-vuetify';

const config = await vuetify({
  stylistic: true,
});

config.push({
  rules: {
    'semi': 'off',
    '@stylistic/semi': ['error', 'always'],
    'vue/script-indent': ['error', 0, {
      baseIndent: 0,
    }],
  },
});

export default config;