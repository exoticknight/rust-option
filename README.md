# rust-option

brings Option in Rust to Javascript

## Install

```bash
npm i -S rust-option
```

## Usage

also see [Rust Option][option]

> NOTE: this lib will not brings all methods from Rust's Option, see [Note](#Note)

```javascript
import {
  Some,
  None,
} from 'rust-option'

let x = Some(2)
let y = None

match(x, [
  [Some(2), () => console.log('match')],
  [None, () => console.log('match None')],
  [() => console.log('match default')],
])
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
} from '../src'

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

## Implementation list

TODO

## License

MIT