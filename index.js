'use strict';

const path = require('path');
const debug = require('debug')('jiango:validation');
const { findFilesSync } = require('jiango/lib/utils');
const Ajv = require('ajv').default;

/**
 * 发现定义文件并加载
 * @param {Ajv} ajv
 * @param {string} directory
 */
function discoverSchemas(ajv, directory) {
  let count = 0;
  for (const filepath of findFilesSync(directory, '**/*.schema.json')) {
    const fullpath = path.join(directory, filepath);
    try {
      const schema = require(fullpath);
      if (!schema.$id) {
        schema.$id = filepath.slice(0, -12);
      }
      ajv.addSchema(schema);
      count++;
    } catch (e) {
      throw new Error(`schema error [${fullpath}]: ${e.message}`);
    }
  }
  debug('schemas [%s] %o files', directory, count);
}

/**
 * @param {import('jiango/lib/core')} core 
 * @param {object} [options]
 * @param {import('ajv').Options} [options.ajv]
 * @param {number} [options.failCode=100]
 * @param {number} [options.failHttpCode]
 * @param {string[]} [options.schemaPaths]
 */
function validation(core, options) {
  options = Object.assign({
    failCode: 100,
  }, options);

  debug('options: %o', options);

  const ajv = new Ajv(options.ajv);

  // load schemas
  if (options.schemaPaths) {
    options.schemaPaths.forEach(d => discoverSchemas(ajv, d));
  } else {
    discoverSchemas(ajv, path.join(process.cwd(), 'validation'));
  }

  /**
   * ctx.validate
   * @param {string|import('ajv').Schema} schema schema name or object
   * @param {*} [data=ctx.request.body]
   * @throws fail
   */
  core.koa.context.validate = function validate(schema, data) {
    const validate = typeof schema === 'string' ? ajv.getSchema(schema) : ajv.compile(schema);
    if (!validate) {
      throw new Error(`validation schema [${schema}] not defined`);
    }
    if (!validate(data || this.request.body)) {
      this.fail({
        code: options.failCode,
        httpCode: options.failHttpCode,
        message: 'validate error',
        data: validate.errors,
      });
    }
  };
}

module.exports = validation;
