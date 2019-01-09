import lodashEqual from 'lodash.isequal'
import a = require('./IOption')
export import Option = a.Option
import b = require('./IResult')
export import Result = b.Result

import { Option } from './IOption'
import { Result } from './IResult'

export const Arguments = Symbol('Arguments')

function getTag(sth:any):string {
  return Object.prototype.toString.call(sth).slice(8, -1)
}

function normalEqual(left:any, right:any, deep:boolean):boolean {
  if (deep) {
    return lodashEqual(left, right)
  } else {
    return (left === right) || (Number.isNaN(left) && Number.isNaN(right))
  }
}

function matchObject(value:any, matcher:any, deep:boolean):boolean {
  const mProps = Object.getOwnPropertyNames(matcher)
  return mProps.every(p => isMatch(value[p], matcher[p], deep))
}

function isMatch(thisValue:any, value:any, deep:boolean):boolean {
  // recursive
  if (value instanceof some) return thisValue instanceof some && isMatch(thisValue.unwrap(), value.unwrap(), deep)
  if (value instanceof ok) return thisValue instanceof ok && isMatch(thisValue.unwrap(), value.unwrap(), deep)
  if (value instanceof err) return thisValue instanceof err && isMatch(thisValue.unwrapErr(), value.unwrapErr(), deep)
  if (value instanceof none) return thisValue instanceof none

  let matchFound = false

  // equal is a kind of perfect match
  if (normalEqual(thisValue, value, deep)) return true

  // check basic type
  // 1 matchs Number
  // NaN matches Number
  // 'yeah' matchs String
  // false matchs Boolean
  // function f(){} matchs Function
  // new Date matchs Date
  // [1,2,4] matchs Array
  // /foo/ matchs RegExp
  // new Set matchs Set
  // new Map matchs Map
  // new WeakMap matchs WeakMap
  // new WeakSet matchs WeakSet
  // Symbol.iterator matchs Symbol
  // arguments matches Arguments
  // new Error matches Error
  // {a:1 , b:2 } matchs object, matchs {a: 1}, matches {a: Number}
  const type = getTag(thisValue)
  switch (type) {
    case 'Number':
      value === Number && (matchFound = true)
      break
    case 'String':
      value === String && (matchFound = true)
      break
    case 'Boolean':
      value === Boolean && (matchFound = true)
      break
    case 'Function':
      value === Function && (matchFound = true)
      break
    case 'Date':
      matchFound = (value === Date) || (getTag(value) === 'Date' && thisValue.valueOf() === value.valueOf())
      break
    case 'Array':
      value === Array && (matchFound = true)
      break
    case 'RegExp':
      value === RegExp && (matchFound = true)
      break
    case 'Map':
      value === Map && (matchFound = true)
      break
    case 'WeakMap':
      value === WeakMap && (matchFound = true)
      break
    case 'Set':
      value === Set && (matchFound = true)
      break
    case 'WeakSet':
      value === WeakSet && (matchFound = true)
      break
    case 'Symbol':
      value === Symbol && (matchFound = true)
      break
    case 'Arguments':
      value === Arguments && (matchFound = true)
      break
    case 'Error':
      value === Error && (matchFound = true)
      break
    case 'Object':
      // class A {}
      // new A match A
      // new B match A if B extends A
      switch (getTag(value)) {
        case 'Function':
          thisValue instanceof value && (matchFound = true)
          break
        case 'Object':
          matchFound = matchObject(thisValue, value, deep)
          break
        default:
          break;
      }
      break
    default:
      break
  }
  if (matchFound) return true

  return false
}

function isEqual(thisValue:any, value:any, deep:boolean):boolean {
  // recursive
  if ((value instanceof some && thisValue instanceof some)
    || (value instanceof ok && thisValue instanceof ok)) {
    return isEqual(thisValue.unwrap(), value.unwrap(), deep)
  }
  if (value instanceof err && thisValue instanceof err) {
    return isEqual(thisValue.unwrapErr(), value.unwrapErr(), deep)
  }

  // check
  return normalEqual(thisValue, value, deep)
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

  // @ts-ignore: noUnusedParameters
  unwrapOr(placeholder:T):T {
    return this.value
  }

  // @ts-ignore: noUnusedParameters
  unwrapOrElse(placeholderFn:()=>T):T {
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

  transpose():any {
    if (this.value instanceof ok) {
      return Ok(Some(this.value.unwrap()))
    } else if (this.value instanceof err) {
      return Err(this.value.unwrapErr())
    } else {
      throw new Error('value is not Result!')
    }
  }

  equal(optb:Option<T>, deep:boolean=false):boolean {
    return optb.isSome() && isEqual(this.value, optb.unwrap(), deep)
  }
}

class none<T> implements Option<T> {

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

  unwrapOr(placeholder:T):T {
    return placeholder
  }

  unwrapOrElse(placeholderFn:()=>T):T {
    return placeholderFn()
  }

  // @ts-ignore: noUnusedParameters
  map<U>(fn:(value:T)=>U):Option<U> {
    return None
  }

  // @ts-ignore: noUnusedParameters
  mapOr<U>(placeholder:U, fn:(value:T)=>U):U {
    return placeholder
  }

  // @ts-ignore: noUnusedParameters
  mapOrElse<U>(placeholderFn:()=>U, fn:(value:T)=>U):U {
    return placeholderFn()
  }

  // @ts-ignore: noUnusedParameters
  and<any>(optb:Option<U>):Option<any> {
    return this
  }

  // @ts-ignore: noUnusedParameters
  andThen<any>(fn:(value:T)=>Option<U>):Option<any> {
    return this
  }

  // @ts-ignore: noUnusedParameters
  filter(predicate:(value:T)=>boolean):Option<T> {
    return this
  }

  or(optb:Option<T>):Option<T> {
    return optb
  }

  orElse(fn:()=>Option<T>):Option<T> {
    return fn()
  }

  xor(optb:Option<T>):Option<T> {
    return optb.isSome() ? optb : this
  }

  transpose():any {
    return Ok(this)
  }

  equal(optb:Option<any>):boolean {
    return optb.isNone()
  }
}

export function Some<T>(value:T):Option<T> {
  return new some(value)
}

export const None:Option<any> = new none

class ok<T, E> implements Result<T, E> {
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

  err():Option<E> {
    return None
  }

  map<U>(op:(t:T)=>U):Result<U, E> {
    return Ok(op(this.value))
  }

  // @ts-ignore: noUnusedParameters
  mapOrElse<U>(fallback:(e:E)=>U, map:(t:T)=>U):U {
    return map(this.value)
  }

  // @ts-ignore: noUnusedParameters
  mapErr<F>(op:(e:E)=>F):Result<T, F> {
    return Ok(this.value)
  }

  and<U>(res:Result<U, E>):Result<U, E> {
    return res
  }

  andThen<U>(op:(t:T)=>Result<U, E>):Result<U, E> {
    return op(this.value)
  }

  // @ts-ignore: noUnusedParameters
  or(res:Result<T, F>):Result<T, F> {
    return this
  }

  // @ts-ignore: noUnusedParameters
  orElse(op:(e:E)=>Result<T, F>):Result<T, F> {
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

  unwrapErr():E {
    throw new Error(String(this.value))
  }

  expectErr(msg:string):E {
    throw new Error(msg + ': ' + String(this.value))
  }

  transpose():any {
    if (this.value instanceof some) {
      return Some(Ok(this.value.unwrap()))
    } else if (this.value instanceof none) {
      return None
    } else {
      throw new Error('value is not Option!')
    }
  }

  equal(resb:Result<T, E>, deep:boolean=false):boolean {
    return resb.isOk() && isEqual(this.value, resb.unwrap(), deep)
  }
}

class err<T, E> implements Result<T, E> {
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

  ok():Option<T> {
    return None
  }

  err():Option<E> {
    return Some(this.error)
  }

  // @ts-ignore: noUnusedParameters
  map(op:(t:T)=>U):Result<U, E> {
    return Err(this.error)
  }

  // @ts-ignore: noUnusedParameters
  mapOrElse<U>(fallback:(e:E)=>U, map:(t:T)=>U):U {
    return fallback(this.error)
  }

  mapErr<F>(op:(e:E)=>F):Result<T, F> {
    return Err(op(this.error))
  }

  // @ts-ignore: noUnusedParameters
  and<U>(res:Result<U, E>):Result<U, E> {
    return Err(this.error)
  }

  // @ts-ignore: noUnusedParameters
  andThen(op:(t:T)=>Result<U, E>):Result<U, E> {
    return Err(this.error)
  }

  or<F>(res:Result<T, F>):Result<T, F> {
    return res
  }

  orElse<F>(op:(e:E)=>Result<T, F>):Result<T, F> {
    return op(this.error)
  }

  unwrapOr<T>(optb:T):T {
    return optb
  }

  unwrapOrElse<T>(op:(e:E)=>T):T {
    return op(this.error)
  }

  unwrap():T {
    throw new Error(String(this.error))
  }

  expect(msg:string):T {
    throw new Error(msg + ': ' + String(this.error))
  }

  unwrapErr():E {
    return this.error
  }

  // @ts-ignore: noUnusedParameters
  expectErr(msg:string):E {
    return this.error
  }

  transpose():any {
    return Some(Err(this.error))
  }

  equal<T>(resb:Result<T, E>, deep:boolean=false):boolean {
    return resb.isErr() && isEqual(this.error, resb.unwrapErr(), deep)
  }
}

export function Ok<T>(value:T):Result<T, any> {
  return new ok(value)
}

export function Err<E>(error:E):Result<any, E> {
  return new err(error)
}

// helper functions
export function makeMatch(branches:(((x:any)=>any) | [any, (x?:any)=>any])[], deep:boolean=false):(opt:any)=>any {
  return (x:any) => {
    for(let i=0,len=branches.length; i<len; i++) {
      const branch = branches[i]
      if (typeof branch === 'function') {  // default
        return branch(x)
      } else {
        if (isMatch(x, branch[0], deep)) {
          return branch[1]()
        }
      }
    }

    // no match, not allow
    throw new Error('non-exhaustive patterns')
  }
}

export function match(opt:any, branches:(((x:any)=>any) | [any, (x?:any)=>any])[], deep:boolean=false):any {
  return makeMatch(branches, deep)(opt)
}