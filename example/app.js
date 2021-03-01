'use strict';

process.env.DEBUG = '*';

const app = module.exports = require('zenweb').create();
const { setup } = require('..');
app.setup(setup);
app.start();
