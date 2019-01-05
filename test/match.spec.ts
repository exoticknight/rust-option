import test from 'tape'

import {
  Some,
  None,

  Ok,
  Err,

  match,
} from '../src'

test('match Option', t => {
  match(Some(2), [
    [None, () => t.fail('Some not match None')],
    [Some(1), () => t.fail('Some 2 not match 1')],
    [Some(2), () => t.pass('Some match')],
    () => t.fail('Some not match'),
  ])

  match(None, [
    [Some(1), () => t.fail('None not match 1')],
    [None, () => t.pass('None match')],
    () => t.fail('None not match'),
  ])

  // default match
  match(Some(3), [
    [Some(1), () => t.fail('Some 3 not match 1')],
    [Some(2), () => t.fail('Some 3 not match 2')],
    x => t.true(x.equal(Some(3))),
  ])

  // no match
  try {
    match(Some(3), [
      [Some(1), () => t.fail('no match')],
      [Some(2), () => t.fail('no match')],
    ])
  } catch (error) {
    t.pass('should throws no match')
  }

  // greedy match
  match(Some(3), [
    [Some(1), () => t.fail('greedy not match 1')],
    () => t.pass('greedy match'),
    [Some(3), () => t.fail('greedy not match 3')],
  ])

  // deep match
  match(Some({foo: 1}), [
    [None, () => t.fail('deep not match None')],
    [Some({foo: 2}), () => t.fail('deep not match foo:2')],
    [Some({foo: 1}), () => t.pass('deep match')],
    () => t.fail('deep not match default'),
  ], true)

  t.end()
})

test('match Result', t => {
  match(Ok(2), [
    [Err('error'), () => t.fail('Ok not match Err')],
    [Ok(1), () => t.fail('Ok 2 not match 1')],
    [Ok(2), () => t.pass('Ok match')],
    () => t.fail('Ok not match'),
  ])

  match(Err('error'), [
    [Ok(1), () => t.fail('Err not match 1')],
    [Err('error'), () => t.pass('Err match')],
    () => t.fail('Err not match'),
  ])

  // deep match
  match(Ok({foo: 1}), [
    [Err('error'), () => t.fail('deep not match Err')],
    [Ok({foo: 2}), () => t.fail('deep not match foo:2')],
    [Ok({foo: 1}), () => t.pass('deep match')],
    () => t.fail('deep not match default'),
  ], true)

  // nest
  match(Ok(Some(1)), [
    [Ok(1), () => t.fail('not match Some(1)')],
    [Ok(Some(1)), () => t.pass('nest match')]
  ])

  t.end()
})

test('match normal', t => {
  match(1, [[Number, () => t.pass('match 1')], () => t.fail('not match Number')])
  match('str', [[String, () => t.pass('match String')], () => t.fail('not match String')])
  match(false, [[Boolean, () => t.pass('match Boolean')], () => t.fail('not match Boolean')])
  match(function f(){}, [[Function, () => t.pass('match Function')], () => t.fail('not match Function')])
  match(new Date, [[Date, () => t.pass('match Date')], () => t.fail('not match Date')])
  match([1,2,4], [[Array, () => t.pass('match Array')], () => t.fail('not match Array')])
  match(/foo/, [[RegExp, () => t.pass('match RegExp')], () => t.fail('not match RegExp')])
  match(new Set, [[Set, () => t.pass('match Set')], () => t.fail('not match Set')])
  match(new Map, [[Map, () => t.pass('match Map')], () => t.fail('not match Map')])

  class A {}
  class B extends A {}
  match(new A, [[A, () => t.pass('match instance')], () => t.fail('not match instance')])
  match(new B, [[A, () => t.pass('match inherit instance')], () => t.fail('not match inherit instance')])

  t.end()
})

