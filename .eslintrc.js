module.exports = {
  extends: [
    'next/core-web-vitals',
    'react-app',
    'plugin:import/errors',
    'plugin:import/warnings',
    'plugin:import/typescript',
    'prettier',
  ],
  rules: {
    'object-shorthand': ['error', 'always'],
    'import/named': ['off'],
    'import/order': ['error', { 'newlines-between': 'always' }],
    'import/no-anonymous-default-export': ['off'],
    'import/no-internal-modules': [
      'error',
      {
        allow: [
          'next/*',
          'next-auth/*',
          '**/modules/*',
          '**/components/*',
          '**/generated/**/*',
          '**/generated/*',
        ],
      },
    ],
  },
};
