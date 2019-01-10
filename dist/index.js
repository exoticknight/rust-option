"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const lodash_isequal_1 = __importDefault(require("lodash.isequal"));
exports.Arguments = Symbol('Arguments');
function getTag(sth) {
    return Object.prototype.toString.call(sth).slice(8, -1);
}
function normalEqual(left, right, deep) {
    if (deep) {
        return lodash_isequal_1.default(left, right);
    }
    else {
        return (left === right) || (Number.isNaN(left) && Number.isNaN(right));
    }
}
function matchObject(value, matcher, deep) {
    const mProps = Object.getOwnPropertyNames(matcher);
    return mProps.every(p => isMatch(value[p], matcher[p], deep));
}
function isMatch(thisValue, value, deep) {
    // recursive
    if (value instanceof some)
        return thisValue instanceof some && isMatch(thisValue.unwrap(), value.unwrap(), deep);
    if (value instanceof ok)
        return thisValue instanceof ok && isMatch(thisValue.unwrap(), value.unwrap(), deep);
    if (value instanceof err)
        return thisValue instanceof err && isMatch(thisValue.unwrapErr(), value.unwrapErr(), deep);
    if (value instanceof none)
        return thisValue instanceof none;
    let matchFound = false;
    // equal is a kind of perfect match
    if (normalEqual(thisValue, value, deep))
        return true;
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
    const type = getTag(thisValue);
    switch (type) {
        case 'Number':
            value === Number && (matchFound = true);
            break;
        case 'String':
            value === String && (matchFound = true);
            break;
        case 'Boolean':
            value === Boolean && (matchFound = true);
            break;
        case 'Function':
            value === Function && (matchFound = true);
            break;
        case 'Date':
            matchFound = (value === Date) || (getTag(value) === 'Date' && thisValue.valueOf() === value.valueOf());
            break;
        case 'Array':
            value === Array && (matchFound = true);
            break;
        case 'RegExp':
            value === RegExp && (matchFound = true);
            break;
        case 'Map':
            value === Map && (matchFound = true);
            break;
        case 'WeakMap':
            value === WeakMap && (matchFound = true);
            break;
        case 'Set':
            value === Set && (matchFound = true);
            break;
        case 'WeakSet':
            value === WeakSet && (matchFound = true);
            break;
        case 'Symbol':
            value === Symbol && (matchFound = true);
            break;
        case 'Arguments':
            value === exports.Arguments && (matchFound = true);
            break;
        case 'Error':
            value === Error && (matchFound = true);
            break;
        case 'Object':
            // class A {}
            // new A match A
            // new B match A if B extends A
            switch (getTag(value)) {
                case 'Function':
                    thisValue instanceof value && (matchFound = true);
                    break;
                case 'Object':
                    matchFound = matchObject(thisValue, value, deep);
                    break;
                default:
                    break;
            }
            break;
        default:
            break;
    }
    if (matchFound)
        return true;
    return false;
}
function isEqual(thisValue, value, deep) {
    // recursive
    if ((value instanceof some && thisValue instanceof some)
        || (value instanceof ok && thisValue instanceof ok)) {
        return isEqual(thisValue.unwrap(), value.unwrap(), deep);
    }
    if (value instanceof err && thisValue instanceof err) {
        return isEqual(thisValue.unwrapErr(), value.unwrapErr(), deep);
    }
    // check
    return normalEqual(thisValue, value, deep);
}
class some {
    constructor(value) {
        this.value = value;
    }
    isNone() {
        return false;
    }
    isSome() {
        return true;
    }
    expect() {
        return this.value;
    }
    unwrap() {
        return this.value;
    }
    // @ts-ignore: noUnusedParameters
    unwrapOr(placeholder) {
        return this.value;
    }
    // @ts-ignore: noUnusedParameters
    unwrapOrElse(placeholderFn) {
        return this.value;
    }
    map(fn) {
        return Some(fn(this.value));
    }
    // @ts-ignore: noUnusedParameters
    mapOr(placeholder, fn) {
        return fn(this.value);
    }
    // @ts-ignore: noUnusedParameters
    mapOrElse(placeholderFn, fn) {
        return fn(this.value);
    }
    and(optb) {
        return optb;
    }
    andThen(fn) {
        return fn(this.value);
    }
    filter(predicate) {
        return predicate(this.value) ? this : exports.None;
    }
    // @ts-ignore: noUnusedParameters
    or(optb) {
        return this;
    }
    // @ts-ignore: noUnusedParameters
    orElse(fn) {
        return this;
    }
    xor(optb) {
        return optb.isNone() ? this : exports.None;
    }
    transpose() {
        if (this.value instanceof ok) {
            return Ok(Some(this.value.unwrap()));
        }
        else if (this.value instanceof err) {
            return Err(this.value.unwrapErr());
        }
        else {
            throw new Error('value is not Result!');
        }
    }
    equal(optb, deep = false) {
        return optb.isSome() && isEqual(this.value, optb.unwrap(), deep);
    }
}
class none {
    isNone() {
        return true;
    }
    isSome() {
        return false;
    }
    expect(msg) {
        throw new Error(msg);
    }
    unwrap() {
        throw new Error('cannot unwrap None');
    }
    unwrapOr(placeholder) {
        return placeholder;
    }
    unwrapOrElse(placeholderFn) {
        return placeholderFn();
    }
    // @ts-ignore: noUnusedParameters
    map(fn) {
        return exports.None;
    }
    // @ts-ignore: noUnusedParameters
    mapOr(placeholder, fn) {
        return placeholder;
    }
    // @ts-ignore: noUnusedParameters
    mapOrElse(placeholderFn, fn) {
        return placeholderFn();
    }
    // @ts-ignore: noUnusedParameters
    and(optb) {
        return this;
    }
    // @ts-ignore: noUnusedParameters
    andThen(fn) {
        return this;
    }
    // @ts-ignore: noUnusedParameters
    filter(predicate) {
        return this;
    }
    or(optb) {
        return optb;
    }
    orElse(fn) {
        return fn();
    }
    xor(optb) {
        return optb.isSome() ? optb : this;
    }
    transpose() {
        return Ok(this);
    }
    equal(optb) {
        return optb.isNone();
    }
}
function Some(value) {
    return new some(value);
}
exports.Some = Some;
exports.None = new none;
class ok {
    constructor(value) {
        this.value = value;
    }
    isOk() {
        return true;
    }
    isErr() {
        return false;
    }
    ok() {
        return Some(this.value);
    }
    err() {
        return exports.None;
    }
    map(op) {
        return Ok(op(this.value));
    }
    // @ts-ignore: noUnusedParameters
    mapOrElse(fallback, map) {
        return map(this.value);
    }
    // @ts-ignore: noUnusedParameters
    mapErr(op) {
        return Ok(this.value);
    }
    and(res) {
        return res;
    }
    andThen(op) {
        return op(this.value);
    }
    // @ts-ignore: noUnusedParameters
    or(res) {
        return this;
    }
    // @ts-ignore: noUnusedParameters
    orElse(op) {
        return this;
    }
    // @ts-ignore: noUnusedParameters
    unwrapOr(optb) {
        return this.value;
    }
    // @ts-ignore: noUnusedParameters
    unwrapOrElse(op) {
        return this.value;
    }
    unwrap() {
        return this.value;
    }
    // @ts-ignore: noUnusedParameters
    expect(msg) {
        return this.value;
    }
    unwrapErr() {
        throw new Error(String(this.value));
    }
    expectErr(msg) {
        throw new Error(msg + ': ' + String(this.value));
    }
    transpose() {
        if (this.value instanceof some) {
            return Some(Ok(this.value.unwrap()));
        }
        else if (this.value instanceof none) {
            return exports.None;
        }
        else {
            throw new Error('value is not Option!');
        }
    }
    equal(resb, deep = false) {
        return resb.isOk() && isEqual(this.value, resb.unwrap(), deep);
    }
}
class err {
    constructor(error) {
        this.error = error;
    }
    isOk() {
        return false;
    }
    isErr() {
        return true;
    }
    ok() {
        return exports.None;
    }
    err() {
        return Some(this.error);
    }
    // @ts-ignore: noUnusedParameters
    map(op) {
        return Err(this.error);
    }
    // @ts-ignore: noUnusedParameters
    mapOrElse(fallback, map) {
        return fallback(this.error);
    }
    mapErr(op) {
        return Err(op(this.error));
    }
    // @ts-ignore: noUnusedParameters
    and(res) {
        return Err(this.error);
    }
    // @ts-ignore: noUnusedParameters
    andThen(op) {
        return Err(this.error);
    }
    or(res) {
        return res;
    }
    orElse(op) {
        return op(this.error);
    }
    unwrapOr(optb) {
        return optb;
    }
    unwrapOrElse(op) {
        return op(this.error);
    }
    unwrap() {
        throw new Error(String(this.error));
    }
    expect(msg) {
        throw new Error(msg + ': ' + String(this.error));
    }
    unwrapErr() {
        return this.error;
    }
    // @ts-ignore: noUnusedParameters
    expectErr(msg) {
        return this.error;
    }
    transpose() {
        return Some(Err(this.error));
    }
    equal(resb, deep = false) {
        return resb.isErr() && isEqual(this.error, resb.unwrapErr(), deep);
    }
}
function Ok(value) {
    return new ok(value);
}
exports.Ok = Ok;
function Err(error) {
    return new err(error);
}
exports.Err = Err;
// helper functions
function makeMatch(branches, deep = false) {
    return (x) => {
        for (let i = 0, len = branches.length; i < len; i++) {
            const branch = branches[i];
            if (typeof branch === 'function') { // default
                return branch(x);
            }
            else {
                if (isMatch(x, branch[0], deep)) {
                    return branch[1]();
                }
            }
        }
        // no match, not allow
        throw new Error('non-exhaustive patterns');
    };
}
exports.makeMatch = makeMatch;
function match(opt, branches, deep = false) {
    return makeMatch(branches, deep)(opt);
}
exports.match = match;
//# sourceMappingURL=index.js.map