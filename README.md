# jiango-node-validate
jiango validate module

## Quick start

```bash
$ npm i @jiango/validate
```

app.js
```js
'use strict';

const app = module.exports = require('jiango')();

app.setup('@jiango/validate');

app.router.post('/form');

app.start();
```
