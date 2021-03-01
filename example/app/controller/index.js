'use strict';

const app = require('../../app');

// simple
app.router.post('/simple', ctx => {
  ctx.validate('simple'); // default data: ctx.request.body
  ctx.body = 'ok';
});
