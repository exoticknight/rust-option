import test from 'tape'

import {
  Result,
  Ok,
  Err,
} from '../src'


test('isOk / isErr', t => {
  let x:Result<number, string> = Ok(-3)
  t.true(x.isOk())

  x = Err('Some error message')
  t.false(x.isOk())

  let y:Result<number, string> = Ok(-3)
  t.false(y.isErr())

  y = Err('Some error message')
  t.true(y.isErr())

  t.end()
})