module.exports = {
    "env": {
        "es6": true,
        "node": true
    },
    "parserOptions": {
        "ecmaVersion": 9,
        "sourceType": "module"
    },
    "extends": ["eslint:recommended", "eslint-config-google"],
    "rules": {
        "indent": ["error", "tab"],
        "quotes": ["error", "single"],
        "semi": ["error", "always"],
        "no-console": "off",
        "no-tabs": "off",
        "line-break-style": "off",
        "max-len": "off",
        "prefer-destructuring": "off",
        "no-param-reassign": "off",
        "prefer-template": "off",
        "class-methods-use-this": "off",
        "consistent-return": "off",
        "require-jsdoc": "off",
        "arrow-parens": "off",
        "guard-for-in": "off",
        "object-curly-spacing": "off"
    }
};