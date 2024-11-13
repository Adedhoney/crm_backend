const eslint = require('@eslint/js');
const tseslint = require('typescript-eslint');

const linter = tseslint.config(
    eslint.configs.recommended,
    ...tseslint.configs.recommended,
);
module.export = linter;
