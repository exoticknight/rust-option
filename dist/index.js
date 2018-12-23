"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const lodash_isequal_1 = __importDefault(require("lodash.isequal"));
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
            return Err(this.value.unwrap());
        }
        else {
            throw new Error('value is not Result!');
        }
    }
    equal(optb, deep = false) {
        if (deep) {
            return optb.isSome() && lodash_isequal_1.default(this.value, optb.unwrap());
        }
        else {
            return optb.isSome() && this.value === optb.unwrap();
        }
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
    equal(resb, deep) {
        if (deep) {
            return resb.isOk() && lodash_isequal_1.default(this.value, resb.unwrap());
        }
        else {
            return resb.isOk() && this.value === resb.unwrap();
        }
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
    // @ts-ignore: noUnusedParameters
    equal(resb, deep) {
        return resb.isErr();
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
                if (x.equal(branch[0], deep)) {
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