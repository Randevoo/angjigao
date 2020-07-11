module.exports = {
    plugins: [
        "@typescript-eslint",
        "prettier"  
    ],
    extends: [
        "airbnb-typescript/base",
        "plugin:@typescript-eslint/recommended",
        "plugin:prettier/recommended",
        "prettier",
        "prettier/@typescript-eslint"
    ],
    parserOptions: {
    tsconfigRootDir: __dirname,
    project: [
            "./tsconfig.json"
        ],
    },
    "parserOptions": {
        "ecmaVersion": 2020,
        "sourceType": "module"
    },
    "env": {
        "es6": true,
        "browser": true,
        "node": true
    } 
}