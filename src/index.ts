import * as path from 'path';
import * as globby from 'globby';
import Ajv from 'ajv';
import { Options, SchemaObject } from 'ajv';
import { SetupFunction } from '@zenweb/core';

function cwdPath(p: string): string {
  if (p.startsWith('./')) {
    return path.join(process.cwd(), p.slice(2));
  }
  return p;
}

/**
 * 发现定义文件并加载
 * @returns 加载数量
 */
function discoverSchemas(ajv: Ajv, directory: string): number {
  let count = 0;
  for (const filepath of globby.sync('**/*.schema.json', { cwd: directory })) {
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
  return count;
}

export interface ValidationOption {
  ajv?: Options;

  /**
   * 验证错误时代码
   * @default 100
   */
  failCode?: number;

  /**
   * 验证错误时http代码
   * @default 422
   */
  failStatus?: number;

  /**
   * 验证规则文件目录
   * @default './app/validation'
   */
  schemaPaths?: string[];
}

const defaultOption: ValidationOption = {
  schemaPaths: [path.join(process.cwd(), 'app', 'validation')],
  failCode: 100,
  failStatus: 422,
}

export default function setup(options?: ValidationOption): SetupFunction {
  options = Object.assign({}, defaultOption, options);
  return function validation(setup) {
    setup.debug('option: %o', options);
    setup.checkContextProperty('fail', '需要安装 @zenweb/api');
    const ajv = new Ajv(options.ajv);
    // load schemas
    if (options.schemaPaths && options.schemaPaths.length) {
      options.schemaPaths.forEach(d => {
        d = cwdPath(d);
        const count = discoverSchemas(ajv, d);
        setup.debug('discover: %s %o files', d, count);
      });
    }
    
    /**
     * ctx.validate
     * @param schema schema name or object
     * @param data 默认: ctx.request.body
     * @throws fail
     */
    function validate(schema: string | SchemaObject, data?: any) {
      const v = typeof schema === 'string' ? ajv.getSchema(schema) : ajv.compile(schema);
      if (!v) {
        throw new Error(`validation schema [${schema}] not defined`);
      }
      if (!v(data || this.request.body)) {
        this.fail({
          code: options.failCode,
          status: options.failStatus,
          message: 'validate error',
          data: v.errors,
        });
      }
    }

    setup.defineContextProperty('validate', { value: validate });
  }
}

declare module 'koa' {
  interface DefaultContext {
    /**
     * 验证输入数据是否满足 schema，失败则调用 fail 异常
     * @param schema validation 文件夹下 schema 文件名
     * @param data 输入数据，默认使用 ctx.request.body
     */
    validate(schema: string | SchemaObject, data?: any): void;
  }
}
