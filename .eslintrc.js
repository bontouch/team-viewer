module.exports = {
    env: {
        es6: true,
        node: true
    },
    extends: ['eslint:recommended'],
    parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module'
    },
    rules: {
        'no-restricted-globals': ['error', 'name', 'length'],
        'prefer-arrow-callback': 'error',
        'object-curly-spacing': 'off'
    }
};
