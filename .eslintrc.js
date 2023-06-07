module.exports = {
    env: {
        es6: true,
        node: true
    },
    //parser: '@babel/plugin-proposal-private-property-in-object',
    extends: ['eslint:recommended', 'plugin:react/recommended'],
    parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module'
    },
    rules: {
        'no-restricted-globals': ['error', 'name', 'length'],
        'prefer-arrow-callback': 'error',
        'object-curly-spacing': 'off',
        'react/react-in-jsx-scope': 'off',
        'react/jsx-uses-react': 'off',
        'react/display-name': 'off',
        'react/jsx-filename-extension': [
            1,
            { extensions: ['.js', '.jsx', '.ts', '.tsx'] }
        ],
        'react/prop-types': 0
    }
};
