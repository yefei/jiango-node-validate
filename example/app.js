'use strict';

process.env.DEBUG = '*';

const app = module.exports = require('jiango')();
const validation = require('..');

app.setup(validation);

// simple
app.router.post('/simple', ctx => {
  ctx.validate('simple'); // default data: ctx.request.body
  ctx.body = 'ok';
});

app.start();
