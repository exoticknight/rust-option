import a = require('./IOption');
export import Option = a.Option;
export import NoneError = a.NoneError;
import b = require('./IResult');
export import Result = b.Result;
import { Option } from './IOption';
import { Result } from './IResult';
export declare const Arguments: unique symbol;
/**
 * wrap a value in Some
 *
 * @export
 * @template T
 * @param {T} value
 * @returns {Option<T>}
 */
export declare function Some<T>(value: T): Option<T>;
export declare const None: Option<any>;
/**
 * wrap a value in Ok
 *
 * @export
 * @template T
 * @param {T} value
 * @returns {Result<T, any>}
 */
export declare function Ok<T>(value: T): Result<T, any>;
/**
 * warp a value in Err
 *
 * @export
 * @template E
 * @param {E} error
 * @returns {Result<any, E>}
 */
export declare function Err<E>(error: E): Result<any, E>;
export declare function makeMatch<T>(branches: (((x: any) => T) | [any, T | ((x?: any) => T)])[], deep?: boolean): (opt: any) => T;
export declare function match<T>(opt: any, branches: (((x: any) => T) | [any, T | ((x?: any) => T)])[], deep?: boolean): T;
export declare function matches$(opt: any, pat: any): boolean;
export declare function resultifySync<T, E>(func: (x?: any) => T): (...args: any[]) => Result<T, E>;
export declare function resultify<T, E>(func: (x?: any) => T): (...args: any[]) => Promise<Result<T, E>>;
export declare function optionifySync<T>(func: (x?: any) => T): (...args: any[]) => Option<T>;
export declare function optionify<T>(func: (x?: any) => T): (...args: any[]) => Promise<Option<T>>;
