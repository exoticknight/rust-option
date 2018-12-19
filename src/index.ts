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
   * return true if Option's value is shallow equal to optb's.
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
    } else

    return optb.isSome() && this.value === optb.unwrap()
  }
}

class none implements Option<any> {
  // @ts-ignore: noUnusedParameters
  private value:any = undefined

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

export type Branch = [Function] | [Option<any>, Function]

export function makeMatch<T>(branches:Branch[], deep:boolean=false):(opt:Option<T>)=>any {
  return x => {
    for(let i=0,len=branches.length; i<len; i++) {
      const [optb, blockFn] = branches[i]
      if (blockFn) {
        if (x.equal(optb as Option<any>, deep)) {
          return blockFn()
        }
      } else {  // default
        return (optb as Function)()
      }
    }

    // no match, not allow
    throw new Error('non-exhaustive patterns')
  }
}

export function match<T>(opt:Option<T>, branches:Branch[], deep:boolean=false):any {
  return makeMatch(branches, deep)(opt)
}
