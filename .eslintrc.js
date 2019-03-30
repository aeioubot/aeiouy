module.exports = {
    "env": {
        "es6": true,
        "node": true
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
        "consistent-return": "off"
    }
};