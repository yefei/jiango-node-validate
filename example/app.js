'use strict';

process.env.DEBUG = '*';

const app = module.exports = require('jiango')();
const validation = require('..');

app.setup(validation);

const schema = {
  type: "object",
  properties: {
    foo: {type: "number", minimum: 0},
    bar: {type: "string"},
  },
  required: ["foo", "bar"],
  additionalProperties: false,
};

// simple
app.router.post('/simple', ctx => {
  ctx.validate(schema); // default validate: ctx.request.body
  ctx.body = 'ok';
});

// recommend, precompiled
app.router.post('/recommend', app.validate(schema), ctx => {
});

app.start();
