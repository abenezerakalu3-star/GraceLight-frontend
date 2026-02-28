module.exports = {
    root: true,
    env: {
        browser: true,
        es2022: true,
    },
    parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
        ecmaFeatures: {
            jsx: true,
        },
    },
    settings: {
        react: {
            version: 'detect',
        },
    },
    plugins: ['react', 'react-hooks', 'react-refresh'],
    extends: ['eslint:recommended', 'plugin:react/recommended'],
    rules: {
        'react/react-in-jsx-scope': 'off',
        'react/prop-types': 'off',
        'react/no-unescaped-entities': 'off',
        'react-hooks/exhaustive-deps': 'off',
        'react-refresh/only-export-components': 'off',
        'no-empty': ['error', { allowEmptyCatch: true }],
        'no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
    },
    ignorePatterns: ['dist/', 'node_modules/'],
};
