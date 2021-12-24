'use strict';

process.env.DEBUG = '*';

const app = module.exports = require('zenweb').create();
const { default: validation } = require('../dist/index');
app.setup(validation());
app.start();
