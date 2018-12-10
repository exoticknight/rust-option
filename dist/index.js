"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
let lodashEqual;
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
    unwrapOr() {
        return this.value;
    }
    unwrapOrElse() {
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
    equal(optb, deep = false) {
        if (deep) {
            if (lodashEqual === undefined) {
                throw new Error('deepEqual is not ready, call useDeepEqual to enable it.');
            }
            return optb.isSome() && lodashEqual(this.value, optb.unwrap());
        }
        else
            return optb.isSome() && this.value === optb.unwrap();
    }
}
class none {
    constructor() {
        // @ts-ignore: noUnusedParameters
        this.value = undefined;
    }
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
        return optb.isSome() ? optb : exports.None;
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
// helper functions
function useDeepEqual() {
    if (lodashEqual === undefined) {
        lodashEqual = require('lodash.isequal');
    }
}
exports.useDeepEqual = useDeepEqual;
function optionEqual(opta, optb, deep = false) {
    return opta.isNone() && optb.isNone()
        || (opta.isSome() && optb.isSome() && opta.equal(optb, deep));
}
exports.optionEqual = optionEqual;
function makeMatch(branches, deep = false) {
    return x => {
        for (let i = 0, len = branches.length; i < len; i++) {
            const [optb, blockFn] = branches[i];
            if (blockFn) {
                if (x.equal(optb, deep)) {
                    return blockFn();
                }
            }
            else { // default
                return optb();
            }
        }
        // no match, not allow
        throw new Error('Option must match at least one branch');
    };
}
exports.makeMatch = makeMatch;
function match(opt, branches, deep = false) {
    return makeMatch(branches, deep)(opt);
}
exports.match = match;
