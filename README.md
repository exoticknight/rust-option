# rust-option
[![Build Status](https://travis-ci.org/exoticknight/rust-option.svg?branch=master)](https://travis-ci.org/exoticknight/rust-option)
[![codecov](https://codecov.io/gh/exoticknight/rust-option/branch/master/graph/badge.svg)](https://codecov.io/gh/exoticknight/rust-option)
![license](https://img.shields.io/npm/l/rust-option.svg)

brings Option and Result in Rust to Javascript

## Install

```bash
npm i -S rust-option
```

## Usage

Nearly all methods are similar to the [Rust Documentation][option]

> NOTE: this lib will not brings all methods from Rust's Option, see [Note](#Note)

```javascript
import {
  Some,
  None,
  match,
} from 'rust-option'

let x = Some(2)
let y = None

// Note: matchs are exhaustive
match(x, [
  [Some(2), () => console.log('match')],
  [None, () => console.log('not match None')],
  // the 'default' match
  () => console.log('not match default'),
])
// output 'match'
```

[option]: https://doc.rust-lang.org/std/option/enum.Option.html

## Test

```bash
npm test
```

## The `match` function

`match` function provides match syntax similar to Rust, but in JavaScript way.

```javascript
import {
  Some,
  None,
  match,
} from 'rust-option'

let x = Some(2)
let y = None
```

a normal match

```javascript
match(x, [
  [Some(2), () => console.log('match')],
  [None, () => console.log('not match None')],
  // the 'default' match
  () => console.log('not match default'),
])
```

non-exhaustive match throws Error

```javascript
// this will throws 'non-exhaustive patterns' Error
match(x, [
  [None, () => console.log('not match None')],
])
```

default' branch can get the matchee

```javascript
match(x, [
  m => console.log('default match get Some(2) as parameter')
])
```

## deepEqual

deepEqual in Javascript is not a piece of cake.

This lib provides shallow equal by default, but you can enable deepEqual by calling `useDeepEqual` which is provided by [lodash.isequal][lodash.isequal].

```javascript
import {
  Some
} from 'rust-option'

let ox = Some({foo: 1})
let oy = Some({foo: 1})
ox.equal(oy)  // false
ox.equal(oy, true)  // true
```

[lodash.isequal]: https://www.npmjs.com/package/lodash.isequal

<a name="#Note"></a>
## Note

TODO

## implement for Option

- [x] isSome
- [x] isNone
- [x] expect
- [x] unwrap
- [x] unwrapOr
- [x] unwrapOrElse
- [x] map
- [x] mapOr
- [x] mapOrElse
- [x] and
- [x] andThen
- [x] filter
- [x] or
- [x] orElse
- [x] xor

## not implement for Option

```text
as_ref
as_mut
as_pin_ref
as_pin_mut
ok_or
ok_or_else
iter
iter_mut
get_or_insert
get_or_insert_with
take
replace
cloned
unwrap_or_default
deref
transpose
```

## implement for Result

- [x] isOk
- [x] isErr
- [x] ok
- [x] err
- [x] map
- [x] mapOrElse
- [x] mapErr
- [x] and
- [x] andThen
- [x] or
- [x] orElse
- [x] unwrapOr
- [x] unwrapOrElse
- [x] unwrap
- [x] expect
- [x] unwrapErr
- [x] expectErr

## not implement for Result

TODO

## License

MIT