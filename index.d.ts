import 'koa';
import { Options } from 'ajv';

export interface ValidationOptions {
  ajv?: Options;
  failCode?: number;
  failHttpCode?: number;
  schemaPaths?: string[];
}

export declare function setup(core: Core, options?: ValidationOptions): void;

declare module 'koa' {
  interface BaseContext {
    /**
     * 验证输入数据是否满足 schema，失败则调用 fail 异常
     * @param schema validation 文件夹下 schema 文件名
     * @param data 输入数据，默认使用 ctx.request.body
     */
    validate(schema: string | object, data?: any): void;
  }
}
