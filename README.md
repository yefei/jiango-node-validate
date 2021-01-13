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

app.router.post('/json');

app.start();
```
