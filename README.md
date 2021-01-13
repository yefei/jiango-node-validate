# jiango-node-validation
jiango validation module

## Quick start

```bash
$ npm i @jiango/validation
```

app.js
```js
'use strict';

const app = module.exports = require('jiango')();

app.setup('@jiango/validation');

app.router.post('/simple', ctx => {
  ctx.validate('simple'); // default data: ctx.request.body
  ctx.body = 'ok';
});

app.start();
```

validation/simple.schema.json
```json
{
  "type": "object",
  "properties": {
    "foo": { "type": "number", "minimum": 0 },
    "bar": { "type": "string", "maxLength": 10, "minLength": 2 }
  },
  "required": ["foo", "bar"],
  "additionalProperties": false
}
```
