# rust-option

brings Option in Rust to Javascript

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
  [() => console.log('not match default')],
])

// this will throws 'non-exhaustive patterns'
match(x, [
  [None, () => console.log('not match None')],
])
// output 'match'
```

[option]: https://doc.rust-lang.org/std/option/enum.Option.html

## Test

```bash
npm test
```

## deepEqual

deepEqual in Javascript is not a piece of cake.

This lib provides shallow equal by default, but you can enable deepEqual by calling `useDeepEqual` which is provided by [lodash.isequal][lodash.isequal].

```javascript
import {
  Some,
  useDeepEqual
} from 'rust-option'

let ox = Some({foo: 1})
let oy = Some({foo: 1})
ox.equal(oy)  // false
ox.equal(oy, true)  // throws error

useDeepEqual()
let ox = Some({foo: 1})
let oy = Some({foo: 1})
ox.equal(oy)  // false
ox.equal(oy, true)  // true
```

[lodash.isequal]: https://www.npmjs.com/package/lodash.isequal

<a name="#Note"></a>
## Note

TODO

## Implementation

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

## not implement

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

## License

MIT