'use strict';

const debug = require('debug')('jiango:validation');
const Ajv = require('ajv').default;

/**
 * @param {import('jiango/lib/core')} core 
 * @param {object} [options]
 * @param {import('ajv').Options} [options.ajv]
 * @param {number} [options.failCode=100]
 * @param {number} [options.failHttpCode]
 */
function validation(core, options) {
  options = Object.assign({
    ajv: {
      allErrors: true,
    },
    failCode: 100,
  }, options);

  debug('options: %o', options);

  const ajv = new Ajv(options.ajv);

  // ctx.validate
  core.koa.context.validate = function validate(schema) {
    const validate = ajv.compile(schema);
    if (!validate(this.request.body)) {
      this.fail({
        code: options.failCode,
        httpCode: options.failHttpCode,
        message: 'validate error',
        data: validate.errors,
      });
    }
  };

  // app.validate middleware
  core.validate = function() {
  };
  function validateMiddleware(ctx, next) {
  }

  core.koa.use(validateMiddleware);
}

module.exports = validation;
