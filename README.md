# zenweb-validation
zenweb validation module

## Quick start

```bash
$ npm i @zenweb/validation
```

app.js
```js
'use strict';

const { default: validation } = require('@zenweb/validation');
const app = module.exports = require('zenweb').create();

app.setup(validation());
app.start();
```

app/controller/simple.js
```js
const app = require('../../app');

app.router.post('/simple', ctx => {
  ctx.validate('simple'); // default data: ctx.request.body
  ctx.body = 'ok';
});
```

app/validation/simple.schema.json
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
