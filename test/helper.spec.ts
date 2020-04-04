import test from 'tape'

import {
  Some,
  None,

  Ok,
  Err,

  match,
  makeMatch,
  matches$,

  resultify,
  resultifySync,
  optionify,
  optionifySync,

  Arguments,
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

  match(Some(2), [
    [Some, (x:number) => t.equal(x, 2, 'Some(2) matches Some and get 2')],
    [None, () => t.fail('Some(2) should not match None')]
  ])

  // default match
  match(Some(3), [
    [Some(1), () => t.fail('Some 3 not match 1')],
    [Some(2), () => t.fail('Some 3 not match 2')],
    x => t.true(x.equal(Some(3))),
  ])

  // no function
  let ret = match({a: 1, b: 2}, [
    [{a: 1}, 'match'],
    () => 'not match'
  ])
  t.equal(ret, 'match')

  // other branch will throw error
  try {
    match(1, [1 as any])
  } catch (error) {
    t.pass('should throw error')
  }

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

  match(Some({ code: 1, err: 'http error' }), [
    [Some({ code: 1 }), () => t.pass('unwrap Some')],
    () => t.fail('not unwrap Some')
  ])

  match(None, [
    [None, () => t.pass('match None')],
    () => t.fail('not match None')
  ])

  t.end()
})

test('match Result', t => {
  match(Ok(2), [
    [Err('error'), () => t.fail('Ok not match Err')],
    [Ok(1), () => t.fail('Ok 2 not match 1')],
    [Ok(2), () => t.pass('Ok match')],
    () => t.fail('Ok not match'),
  ])

  match(Ok(2), [
    [Err, () => t.fail('Ok not match Err')],
    [Ok, () => t.pass('Ok match')],
    () => t.fail('Ok not match'),
  ])

  match(Err('error'), [
    [Ok(1), () => t.fail('Err not match 1')],
    [Err('error'), () => t.pass('Err match')],
    () => t.fail('Err not match'),
  ])

  match(Err('error'), [
    [Ok, () => t.fail('Err not match Ok')],
    [Err, () => t.pass('Err match')],
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
  let x = Some(1)
  match(Ok(x), [
    [Ok(1), () => t.fail('not match Some(1)')],
    [Ok(Some(1)), () => t.pass('nest match')]
  ])

  match(Ok({ code: 1, err: 'http error' }), [
    [Ok({ code: 1 }), () => t.pass('unwrap Result')],
    () => t.fail('not unwrap Result')
  ])

  match(Err({ code: 1, err: 'http error' }), [
    [Err({ code: 1 }), () => t.pass('unwrap Err')],
    () => t.fail('not unwrap Err')
  ])

  t.end()
})

test('match normal', t => {
  match(1, [[Number, () => t.pass('match 1')], () => t.fail('not match Number')])
  match(NaN, [[Number, () => t.pass('NaN is number')], () => t.fail('not match NaN')])
  match('yeah', [['yeah', () => t.pass('match String')], () => t.fail('not match String')])
  match('yeah', [['ea', () => t.pass('match String')], () => t.fail('not match String')])
  match('yeah', [[String, () => t.pass('match String')], () => t.fail('not match String')])
  match(false, [[Boolean, () => t.pass('match Boolean')], () => t.fail('not match Boolean')])
  match(function f(){}, [[Function, () => t.pass('match Function')], () => t.fail('not match Function')])
  match(new Date('2000-01-01'), [[Date, () => t.pass('match Date')], () => t.fail('not match Date')])
  match(new Date('2000-01-01'), [[new Date('2000-01-01'), () => t.pass('match Date')], () => t.fail('not match Date')])
  match([1,2,4], [[Array, () => t.pass('match Array')], () => t.fail('not match Array')])
  match(/foo/, [[RegExp, () => t.pass('match RegExp')], () => t.fail('not match RegExp')])
  match(new Set, [[Set, () => t.pass('match Set')], () => t.fail('not match Set')])
  match(new Map, [[Map, () => t.pass('match Map')], () => t.fail('not match Map')])
  match(new WeakSet, [[WeakSet, () => t.pass('match WeakSet')], () => t.fail('not match WeakSet')])
  match(new WeakMap, [[WeakMap, () => t.pass('match WeakMap')], () => t.fail('not match WeakMap')])
  match(Symbol.iterator, [[Symbol, () => t.pass('match Symbol')], () => t.fail('not match Symbol')])
  match(new Error('a'), [[Error, () => t.pass('match Error')], () => t.fail('not match Error')])

  ;(function () {
    match(arguments, [[Arguments, () => t.pass('match Arguments')], () => t.fail('not match Arguments')])
  })()
  match({}, [[Arguments, () => t.fail('{} match Arguments')], () => t.pass('{} not match Arguments')])

  match({}, [[Object, () => t.pass('match object')], () => t.fail('not match object')])
  match({a: 1, b: 2}, [[{a: 1}, () => t.pass('match object')], () => t.fail('not match object')])
  match({a: 2, b: 2}, [[{a: Number}, () => t.pass('match object')], () => t.fail('not match object')])
  match({a: 1}, [[{a: 1, b: 2}, () => t.fail('not match object')], () => t.pass('match object')])

  class A {}
  class B extends A {}
  class C {}
  match(new C, [[A, () => t.fail('new C not match A')], [C, () => t.pass('match instance')]])
  match(new A, [[A, () => t.pass('match instance')], () => t.fail('not match instance')])
  match(new B, [[A, () => t.pass('match inherit instance')], () => t.fail('not match inherit instance')])

  match(undefined, [[1, () => t.fail('undefined not match 1')], () => t.pass('match undefined')])
  match(undefined, [[undefined, () => t.pass('undefined match')], () => t.fail('not match undefined')])
  match(null, [[null, () => t.pass('null match')], () => t.fail('not match null')])
  match(NaN, [[NaN, () => t.pass('NaN match')], () => t.fail('not match NaN')])

  t.end()
})

test('makeMatch', t => {
  makeMatch([[1, () => t.pass('makeMatch 1')], () => t.fail('not match 1')])(1)

  t.end()
})

test('matches$', t => {
  t.true(matches$(Ok(1), Ok(Number)))

  t.end()
})

test('resultify / resultifySync', async t => {
  function returnOne():number {
    return 1
  }

  function throwErr():void {
    throw 'error'
  }

  function returnPromiseOne() {
    return Promise.resolve(1)
  }

  function promiseReject() {
    return Promise.reject('error')
  }

  let x = resultifySync(returnOne)()
  let y = resultifySync(throwErr)()
  let z = await resultify(returnPromiseOne)()
  let w = await resultify(promiseReject)()
  match(x ,[
    [Ok(1), () => t.pass('match Ok(1)')],
    () => t.fail('not match Ok(1)')
  ])
  match(y ,[
    [Err, () => t.pass('match error')],
    () => t.fail('not match error')
  ])
  match(z ,[
    [Ok(1), () => t.pass('match Ok(1)')],
    () => t.fail('not match Ok(1)')
  ])
  match(w ,[
    [Err, () => t.pass('match error')],
    () => t.fail('not match error')
  ])

  t.end()
})

test('optionify / optionifySync', async t => {
  function returnOne():number {
    return 1
  }

  function throwErr():void {
    throw 'error'
  }

  function returnPromiseOne() {
    return Promise.resolve(1)
  }

  function promiseReject() {
    return Promise.reject('error')
  }

  let x = optionifySync(returnOne)()
  let y = optionifySync(throwErr)()
  let z = await optionify(returnPromiseOne)()
  let w = await optionify(promiseReject)()
  match(x ,[
    [Some(1), () => t.pass('match Some(1)')],
    () => t.fail('not match Some(1)')
  ])
  match(y ,[
    [None, () => t.pass('match None')],
    () => t.fail('not match None')
  ])
  match(z ,[
    [Some(1), () => t.pass('match Some(1)')],
    () => t.fail('not match Some(1)')
  ])
  match(w ,[
    [None, () => t.pass('match None')],
    () => t.fail('not match None')
  ])

  t.end()
})