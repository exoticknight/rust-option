let lodashEqual:Function

export interface Option<T> {
  /** rust methods below */
  /**
   * Returns true if the option is a Some value.
   *
   * @returns {boolean}
   * @memberof Option
   */
  isSome():boolean

  /**
   * Returns true if the option is a None value.
   *
   * @returns {boolean}
   * @memberof Option
   */
  isNone():boolean

  /**
   * throw Error if the value is a None with a custom error message provided by msg.
   *
   * @param {string} msg
   * @returns {(T | void)}
   * @memberof Option
   */
  expect(msg:string):T | void

  /**
   * return the value v out of the Option<T> if it is Some(v).
   *
   * @returns {(T | void)}
   * @memberof Option
   */
  unwrap():T | void

  /**
   * Returns the contained value or a placeholder.
   *
   * @param {T} placeholder
   * @returns {T}
   * @memberof Option
   */
  unwrapOr(placeholder:T):T

  /**
   * Returns the contained value or computes it from a placeholderFn.
   *
   * @param {()=>T} placeholderFn
   * @returns {T}
   * @memberof Option
   */
  unwrapOrElse(placeholderFn:()=>T):T

  /**
   * Maps an Option<T> to Option<U> by applying a function to a contained value.
   *
   * @template U
   * @param {(value:T)=>U} fn
   * @returns {Option<U>}
   * @memberof Option
   */
  map<U>(fn:(value:T)=>U):Option<U>

  /**
   * Applies a function to the contained value (if any), or returns the provided placeholder (if not).
   *
   * @template U
   * @param {U} placeholder
   * @param {(value:T)=>U} fn
   * @returns {U}
   * @memberof Option
   */
  mapOr<U>(placeholder:U, fn:(value:T)=>U):U

  /**
   * Applies a function to the contained value (if any), or computes with placeholderFn (if not).
   *
   * @template U
   * @param {()=>U} placeholderFn
   * @param {(value:T)=>U} fn
   * @returns {U}
   * @memberof Option
   */
  mapOrElse<U>(placeholderFn:()=>U, fn:(value:T)=>U):U

  /**
   * Returns None if the option is None, otherwise returns optb.
   *
   * @template U
   * @param {Option<U>} optb
   * @returns {Option<U>}
   * @memberof Option
   */
  and<U>(optb:Option<U>):Option<U>

  /**
   * Returns None if the option is None, otherwise calls f with the wrapped value and returns the result.
   * You can recognize it as flatMap.
   *
   * @template U
   * @param {(value:T)=>Option<U>} fn
   * @returns {Option<U>}
   * @memberof Option
   */
  andThen<U>(fn:(value:T)=>Option<U>):Option<U>

  /**
   *
   *
   * @param {(value:T)=>boolean} predicate
   * @returns {Option<T>}
   * @memberof Option
   */
  filter(predicate:(value:T)=>boolean):Option<T>

  /**
   * Returns the option if it contains a value, otherwise returns optb.
   *
   * @param {Option<T>} optb
   * @returns {Option<T>}
   * @memberof Option
   */
  or(optb:Option<T>):Option<T>

  /**
   * Returns the option if it contains a value, otherwise calls f and returns the result.
   *
   * @param {()=>Option<T>} fn
   * @returns {Option<T>}
   * @memberof Option
   */
  orElse(fn:()=>Option<T>):Option<T>

  /**
   * Returns Some if exactly one of self, optb is Some, otherwise returns None.
   *
   * @param {Option<T>} optb
   * @returns {Option<T>}
   * @memberof Option
   */
  xor(optb:Option<T>):Option<T>
  /** rust methods above */

  // helper methods
  /**
   * return true if Option's value equals to optb's.
   *
   * @param {Option<T>} optb
   * @returns {boolean}
   * @memberof Option
   */
  equal(optb:Option<T>, deep?:boolean):boolean
}

class some<T> implements Option<T> {
  private value:T

  constructor(value:T) {
    this.value = value
  }

  isNone() {
    return false
  }

  isSome() {
    return true
  }

  expect() {
    return this.value
  }

  unwrap() {
    return this.value
  }

  unwrapOr() {
    return this.value
  }

  unwrapOrElse() {
    return this.value
  }

  map<U>(fn:(value:T)=>U):Option<U> {
    return Some(fn(this.value))
  }

  // @ts-ignore: noUnusedParameters
  mapOr<U>(placeholder:U, fn:(value:T)=>U):U {
    return fn(this.value)
  }

  // @ts-ignore: noUnusedParameters
  mapOrElse<U>(placeholderFn:()=>U, fn:(value:T)=>U):U {
    return fn(this.value)
  }

  and<U>(optb:Option<U>):Option<U> {
    return optb
  }

  andThen<U>(fn:(value:T)=>Option<U>):Option<U> {
    return fn(this.value)
  }

  filter(predicate:(value:T)=>boolean):Option<T> {
    return predicate(this.value) ? this : None
  }

  // @ts-ignore: noUnusedParameters
  or(optb:Option<T>):Option<T> {
    return this
  }

  // @ts-ignore: noUnusedParameters
  orElse(fn:()=>Option<T>):Option<T> {
    return this
  }

  xor(optb:Option<T>):Option<T> {
    return optb.isNone() ? this : None
  }

  equal(optb:Option<T>, deep:boolean=false):boolean {
    if (deep) {
      if (lodashEqual === undefined) {
        throw new Error('deepEqual is not ready, call useDeepEqual to enable it.')
      }
      return optb.isSome() && lodashEqual(this.value, optb.unwrap())
    } else {
      return optb.isSome() && this.value === optb.unwrap()
    }
  }
}

class none implements Option<any> {

  isNone() {
    return true
  }

  isSome() {
    return false
  }

  expect(msg:string) {
    throw new Error(msg)
  }

  unwrap() {
    throw new Error('cannot unwrap None')
  }

  unwrapOr(placeholder:any) {
    return placeholder
  }

  unwrapOrElse(placeholderFn:()=>any) {
    return placeholderFn()
  }

  // @ts-ignore: noUnusedParameters
  map<U>(fn:(value:any)=>U):Option<U> {
    return None
  }

  // @ts-ignore: noUnusedParameters
  mapOr<U>(placeholder:U, fn:(value:any)=>U):U {
    return placeholder
  }

  // @ts-ignore: noUnusedParameters
  mapOrElse<U>(placeholderFn:()=>U, fn:(value:any)=>U):U {
    return placeholderFn()
  }

  // @ts-ignore: noUnusedParameters
  and<U>(optb:Option<U>):Option<U> {
    return this
  }

  // @ts-ignore: noUnusedParameters
  andThen<U>(fn:(value:any)=>Option<U>):Option<U> {
    return this
  }

  // @ts-ignore: noUnusedParameters
  filter(predicate:(value:any)=>boolean):Option<any> {
    return this
  }

  or(optb:Option<any>):Option<any> {
    return optb
  }

  orElse(fn:()=>Option<any>):Option<any> {
    return fn()
  }

  xor(optb:Option<any>):Option<any> {
    return optb.isSome() ? optb : None
  }

  equal(optb:Option<any>):boolean {
    return optb.isNone()
  }
}

export function Some<T>(value:T):Option<T> {
  return new some(value)
}

export const None:Option<any> = new none

export interface Result<T, E> {
  /** rust method below */
  /**
   * Returns true if the result is Ok.
   *
   * @returns {boolean}
   * @memberof Result
   */
  isOk():boolean

  /**
   * Returns true if the result is Err.
   *
   * @returns {boolean}
   * @memberof Result
   */
  isErr():boolean

  /**
   * Converts from Result<T, E> to Option<T> and discarding the error, if any.
   *
   * @returns {Option<T>}
   * @memberof Result
   */
  ok():Option<T>

  /**
   * Converts from Result<T, E> to Option<E> and discarding the success value, if any.
   *
   * @returns {Option<E>}
   * @memberof Result
   */
  err():Option<E>

  /**
   * Maps a Result<T, E> to Result<U, E> by applying a function to a contained Ok value, leaving an Err value untouched.
   *
   * This function can be used to compose the results of two functions.
   *
   * @template U
   * @param {(t:T)=>U} op
   * @returns {Result<U, E>}
   * @memberof Result
   */
  map<U>(op:(t:T)=>U):Result<U, E>

  /**
   * Maps a Result<T, E> to U by applying a function to a contained Ok value, or a fallback function to a contained Err value.
   *
   * This function can be used to unpack a successful result while handling an error.
   *
   * @template U
   * @param {(e:E)=>U} fallback
   * @param {(t:T)=>U} map
   * @returns {U}
   * @memberof Result
   */
  mapOrElse<U>(fallback:(e:E)=>U, map:(t:T)=>U):U

  /**
   * Maps a Result<T, E> to Result<T, F> by applying a function to a contained Err value, leaving an Ok value untouched.
   *
   * This function can be used to pass through a successful result while handling an error.
   *
   * @template F
   * @param {(e:E)=>F} op
   * @returns {Result<T, F>}
   * @memberof Result
   */
  mapErr<F>(op:(e:E)=>F):Result<T, F>

  /**
   * Returns res if the result is Ok, otherwise returns the Err value of self.
   *
   * @template U
   * @param {Result<U, E>} res
   * @returns {Result<U, E>}
   * @memberof Result
   */
  and<U>(res:Result<U, E>):Result<U, E>

  /**
   * Calls op if the result is Ok, otherwise returns the Err value of self.
   *
   * This function can be used for control flow based on Result values.
   *
   * @template U
   * @param {(t:T)=>Result<U, E>} op
   * @returns {Result<U, E>}
   * @memberof Result
   */
  andThen<U>(op:(t:T)=>Result<U, E>):Result<U, E>

  /**
   * Returns res if the result is Err, otherwise returns the Ok value of self.
   *
   * @template F
   * @param {Result<T, F>} res
   * @returns {Result<T, F>}
   * @memberof Result
   */
  or<F>(res:Result<T, F>):Result<T, F>

  /**
   * Calls op if the result is Err, otherwise returns the Ok value of self.
   *
   * This function can be used for control flow based on result values.
   *
   * @template F
   * @param {(e:E)=>Result<T, F>} op
   * @returns {Result<T, F>}
   * @memberof Result
   */
  orElse<F>(op:(e:E)=>Result<T, F>):Result<T, F>

  /**
   * Unwraps a result, yielding the content of an Ok. Else, it returns optb.
   *
   * @param {T} optb
   * @returns {T}
   * @memberof Result
   */
  unwrapOr(optb:T):T

  /**
   * Unwraps a result, yielding the content of an Ok. If the value is an Err then it calls op with its value.
   *
   * @param {(e:E)=>T} op
   * @returns {T}
   * @memberof Result
   */
  unwrapOrElse(op:(e:E)=>T):T

  /**
   * Unwraps a result, yielding the content of an Ok.
   *
   * Throws Error if the value is an Err, with a error message provided by the Err's value.
   *
   * @returns {T}
   * @memberof Result
   */
  unwrap():T

  /**
   * Unwraps a result, yielding the content of an Ok.
   *
   * Throws Error if the value is an Err, with a error message including the passed message, and the content of the Err.
   *
   * @param {string} msg
   * @returns {T}
   * @memberof Result
   */
  expect(msg:string):T

  /**
   * Unwraps a result, yielding the content of an Err.
   *
   * Throws Error if the value is an Ok, with a custom error message provided by the Ok's value.
   *
   * @returns {E}
   * @memberof Result
   */
  unwrapErr():E

  /**
   * Unwraps a result, yielding the content of an Err.
   *
   * Throws Error if the value is an Ok, with a error message including the passed message, and the content of the Ok.
   *
   * @param {string} msg
   * @returns {E}
   * @memberof Result
   */
  expectErr(msg:string):E
  /** rust method above */

  // helper method
  /**
   * return true if Result's value equals to resb's.
   *
   * @param {Result<T, E>} resb
   * @returns {boolean}
   * @memberof Result
   */
  equal(optb:Result<T, E>, deep?:boolean):boolean
}

class ok<T> implements Result<T, any>  {
  private value:T

  constructor(value:T) {
    this.value = value
  }

  isOk():boolean {
    return true
  }

  isErr():boolean {
    return false
  }

  ok():Option<T> {
    return Some(this.value)
  }

  err():Option<any> {
    return None
  }

  map<U>(op:(t:T)=>U):Result<U, {}> {
    return Ok(op(this.value))
  }

  // @ts-ignore: noUnusedParameters
  mapOrElse<U>(fallback:(e:E)=>U, map:(t:T)=>U):U {
    return map(this.value)
  }

  // @ts-ignore: noUnusedParameters
  mapErr(op:(e:any)=>any):Result<T, any> {
    // maybe Ok(this.value)
    return this
  }

  and<U>(res:Result<U, any>):Result<U, any> {
    return res
  }

  andThen<U>(op:(t:T)=>Result<U, any>):Result<U, any> {
    return op(this.value)
  }

  // @ts-ignore: noUnusedParameters
  or(res:Result<T, any>):Result<T, any> {
    return this
  }

  // @ts-ignore: noUnusedParameters
  orElse(op:(e:E)=>Result<T, any>):Result<T, any> {
    return this
  }

  // @ts-ignore: noUnusedParameters
  unwrapOr(optb:T):T {
    return this.value
  }

  // @ts-ignore: noUnusedParameters
  unwrapOrElse(op:(e:E)=>T):T {
    return this.value
  }

  unwrap():T {
    return this.value
  }

  // @ts-ignore: noUnusedParameters
  expect(msg:string):T {
    return this.value
  }

  unwrapErr():any {
    throw new Error(String(this.value))
  }

  expectErr(msg:string):any {
    throw new Error(msg + ': ' + String(this.value))
  }

  equal(resb:Result<T, any>, deep?:boolean):boolean {
    if (deep) {
      if (lodashEqual === undefined) {
        throw new Error('deepEqual is not ready, call useDeepEqual to enable it.')
      }
      return resb.isOk() && lodashEqual(this.value, resb.unwrap())
    } else {
      return resb.isOk() && this.value === resb.unwrap()
    }
  }
}

class err<E> implements Result<any, E> {
  private error:E

  constructor(error:E) {
    this.error = error
  }

  isOk():boolean {
    return false
  }

  isErr():boolean {
    return true
  }

  ok():Option<any> {
    return None
  }

  err():Option<E> {
    return Some(this.error)
  }

  // @ts-ignore: noUnusedParameters
  map(op:(t:any)=>any):Result<any, E> {
    // maybe Err(this.error)
    return this
  }

  // @ts-ignore: noUnusedParameters
  mapOrElse<U>(fallback:(e:E)=>U, map:(t:T)=>U):U {
    return fallback(this.error)
  }

  mapErr<F>(op:(e:E)=>F):Result<any, F> {
    return Err(op(this.error))
  }

  // @ts-ignore: noUnusedParameters
  and<U>(res:Result<U, E>):Result<U, E> {
    // maybe Err(this.error)
    return this
  }

  // @ts-ignore: noUnusedParameters
  andThen(op:(t:any)=>Result<any, E>):Result<any, E> {
    // maybe Err(this.error)
    return this
  }

  or<F>(res:Result<any, F>):Result<any, F> {
    return res
  }

  orElse<F>(op:(e:E)=>Result<any, F>):Result<any, F> {
    return op(this.error)
  }

  unwrapOr<T>(optb:T):T {
    return optb
  }

  unwrapOrElse<T>(op:(e:E)=>T):T {
    return op(this.error)
  }

  unwrap():any {
    throw new Error(String(this.error))
  }

  expect(msg:string):any {
    throw new Error(msg + ': ' + String(this.error))
  }

  unwrapErr():E {
    return this.error
  }

  // @ts-ignore: noUnusedParameters
  expectErr(msg:string):any {
    return this.error
  }

  // @ts-ignore: noUnusedParameters
  equal<T>(resb:Result<T, E>, deep?:boolean):boolean {
    return resb.isErr()
  }
}

export function Ok<T>(value:T):Result<T, any> {
  return new ok(value)
}

export function Err<E>(error:E):Result<any, E> {
  return new err(error)
}

// helper functions

export function useDeepEqual() {
  if (lodashEqual === undefined) {
    lodashEqual = require('lodash.isequal')
  }
}

export function optionEqual<T>(opta:Option<T>, optb:Option<T>, deep:boolean=false) {
  return opta.isNone() && optb.isNone()
    || (
      opta.isSome() && optb.isSome() && opta.equal(optb, deep)
    )
}

export function makeMatch<T>(branches:(((x:Option<T>)=>any) | [Option<any>, (x?:Option<T>)=>any])[], deep:boolean=false):(opt:Option<T>)=>any {
  return (x:Option<T>) => {
    for(let i=0,len=branches.length; i<len; i++) {
      const branch = branches[i]
      if (typeof branch === 'function') {  // default
        return branch(x)
      } else {
        if (x.equal(branch[0], deep)) {
          return branch[1]()
        }
      }
    }

    // no match, not allow
    throw new Error('non-exhaustive patterns')
  }
}

export function match<T>(opt:Option<T>, branches:(((x:Option<T>)=>any) | [Option<any>, (x?:Option<T>)=>any])[], deep:boolean=false):any {
  return makeMatch<T>(branches, deep)(opt)
}
