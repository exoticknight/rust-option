import test from 'tape'

import {
  Result,
  Ok,
  Err,
  Some,
  None,
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

test('ok / err', t => {
  let x:Result<number, string> = Ok(2)
  t.true(x.ok().equal(Some(2)))

  x = Err('Nothing here')
  t.true(x.ok().equal(None))

  let y:Result<number, string> = Ok(2)
  t.true(y.err().equal(None))

  y = Err('Nothing here');
  t.true(x.err().equal(Some('Nothing here')))

  t.end()
})

test('mapOrElse', t => {
  let k = 21

  let x:Result<string, string> = Ok('foo')
  t.equal(x.mapOrElse(() => k * 2, v => v.length), 3)

  x = Err('bar')
  t.equal(x.mapOrElse(() => k * 2, v => v.length), 42)

  t.end()
})

test('map / mapErr', t => {
  let x:Result<number, string> = Ok(2)
  t.true(x.map<boolean>(m => m > 1).equal(Ok(true)))

  x = Err('Nothing here')
  t.true(x.map<boolean>(m => m > 1).equal(Err('Nothing here')))

  let y:Result<number, string> = Ok(3)
  t.true(y.mapErr<number>(e => e.length).equal(Ok(3)))

  y = Err('Nothing here')
  t.true(y.mapErr<number>(e => e.length).equal(Err(12)))

  t.end()
})

test('and / andThen', t => {
  let x:Result<number, string> = Ok(2)
  let y:Result<string, string> = Err('late error')
  t.true(x.and(y).equal(Err('late error')))

  x = Err('early error')
  y = Ok('foo')
  t.true(x.and(y).equal(Err('early error')))

  x = Err('not a 2')
  y = Err('late error')
  t.true(x.and(y).equal(Err('not a 2')))

  x = Ok(2)
  y = Ok('different result type')
  t.true(x.and(y).equal(Ok('different result type')))

  const sq = (x:number):Result<number,number> => Ok(x * x)
  const err = (x:number):Result<number,number> => Err(x)

  t.true(Ok(2).andThen(sq).andThen(sq).equal(Ok(16)))
  t.true(Ok(2).andThen(sq).andThen(err).equal(Err(4)))
  t.true(Ok(2).andThen(err).andThen(sq).equal(Err(2)))
  t.true(Err(3).andThen(sq).andThen(sq).equal(Err(3)))

  t.end()
})

test('or / orElse', t => {
  let x:Result<number, string> = Ok(2)
  let y:Result<number, string> = Err('late error')
  t.true(x.or(y).equal(Ok(2)))

  x = Err('early error')
  y = Ok(2)
  t.true(x.or(y).equal(Ok(2)))

  x = Err('not a 2')
  y = Err('late error')
  t.true(x.or(y).equal(Err('late error')))

  x = Ok(2)
  y = Ok(100)
  t.true(x.or(y).equal(Ok(2)))

  const sq = (x:number):Result<number,number> => Ok(x * x)
  const err = (x:number):Result<number,number> => Err(x)

  t.true(Ok(2).orElse(sq).orElse(sq).equal(Ok(2)))
  t.true(Ok(2).orElse(err).orElse(sq).equal(Ok(2)))
  t.true(Err(3).orElse(sq).orElse(err).equal(Ok(9)))
  t.true(Err(3).orElse(err).orElse(err).equal(Err(3)))

  t.end()
})

test('unwrapOr / unwrapOrElse / unwrap', t => {
  let optb = 2
  let x:Result<number, string> = Ok(9)
  t.equal(x.unwrapOr(optb), 9)

  x = Err('error')
  t.equal(x.unwrapOr(optb), optb)

  const count = (x:string):number => x.length
  t.equal(Ok(2).unwrapOrElse(count), 2)
  t.equal(Err('foo').unwrapOrElse(count), 3)

  let y:Result<number, string> = Ok(2)
  t.equal(y.unwrap(), 2)

  y = Err('emergency failure')
  try {
    x.unwrap()
  } catch (error) {
    t.pass('throws error')
  }

  t.end()
})

test('expect', t => {
  let x:Result<number, string> = Ok(2)
  t.equal(x.expect('nothing here'), 2)

  x = Err('emergency failure')
  try {
    x.expect('Testing expect')
  } catch (error) {
    t.equal(error.message, 'Testing expect: emergency failure')
  }

  t.end()
})

test('unwrapErr', t => {
  let x:Result<number, string> = Ok(2)
  try {
    x.unwrapErr()
  } catch (error) {
    t.equal(error.message, '2')
  }

  x = Err('emergency failure')
  t.equal(x.unwrapErr(), 'emergency failure')

  t.end()
})

test('expectErr', t => {
  let x:Result<number, string> = Ok(10)
  try {
    x.expectErr('Testing expect_err')
  } catch (error) {
    t.equal(error.message, 'Testing expect_err: 10')
  }

  x = Err('get it')
  t.equal(x.expectErr('nothing here'), 'get it')

  t.end()
})

test('transpose', t => {
  t.pass()

  t.end()
})

test('nest', t => {
  t.pass()

  t.end()
})

test('equal / deepEqual', t => {
  let x:Result<number, string> = Ok(3)
  let obj:Result<{x:number}, string> = Ok({x:1})

  x.equal(Ok(3))

  t.false(obj.equal(Ok({x:1})))
  t.true(obj.equal(Ok({x:1}), true))

  t.end()
})