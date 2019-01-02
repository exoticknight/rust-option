import {Option} from './IOption'

export interface Result<T, E> {
  /** rust method below */
  /**
   * Returns true if the result is Ok.
   *
   * @returns {boolean}
   * @memberof Result
   */
  isOk():boolean

  /**
   * Returns true if the result is Err.
   *
   * @returns {boolean}
   * @memberof Result
   */
  isErr():boolean

  /**
   * Converts from Result<T, E> to Option<T> and discarding the error, if any.
   *
   * @returns {Option<T>}
   * @memberof Result
   */
  ok():Option<T>

  /**
   * Converts from Result<T, E> to Option<E> and discarding the success value, if any.
   *
   * @returns {Option<E>}
   * @memberof Result
   */
  err():Option<E>

  /**
   * Maps a Result<T, E> to Result<U, E> by applying a function to a contained Ok value, leaving an Err value untouched.
   *
   * This function can be used to compose the results of two functions.
   *
   * @template U
   * @param {(t:T)=>U} op
   * @returns {Result<U, E>}
   * @memberof Result
   */
  map<U>(op:(t:T)=>U):Result<U, E>

  /**
   * Maps a Result<T, E> to U by applying a function to a contained Ok value, or a fallback function to a contained Err value.
   *
   * This function can be used to unpack a successful result while handling an error.
   *
   * @template U
   * @param {(e:E)=>U} fallback
   * @param {(t:T)=>U} map
   * @returns {U}
   * @memberof Result
   */
  mapOrElse<U>(fallback:(e:E)=>U, map:(t:T)=>U):U

  /**
   * Maps a Result<T, E> to Result<T, F> by applying a function to a contained Err value, leaving an Ok value untouched.
   *
   * This function can be used to pass through a successful result while handling an error.
   *
   * @template F
   * @param {(e:E)=>F} op
   * @returns {Result<T, F>}
   * @memberof Result
   */
  mapErr<F>(op:(e:E)=>F):Result<T, F>

  /**
   * Returns res if the result is Ok, otherwise returns the Err value of self.
   *
   * @template U
   * @param {Result<U, E>} res
   * @returns {Result<U, E>}
   * @memberof Result
   */
  and<U>(res:Result<U, E>):Result<U, E>

  /**
   * Calls op if the result is Ok, otherwise returns the Err value of self.
   *
   * This function can be used for control flow based on Result values.
   *
   * @template U
   * @param {(t:T)=>Result<U, E>} op
   * @returns {Result<U, E>}
   * @memberof Result
   */
  andThen<U>(op:(t:T)=>Result<U, E>):Result<U, E>

  /**
   * Returns res if the result is Err, otherwise returns the Ok value of self.
   *
   * @template F
   * @param {Result<T, F>} res
   * @returns {Result<T, F>}
   * @memberof Result
   */
  or<F>(res:Result<T, F>):Result<T, F>

  /**
   * Calls op if the result is Err, otherwise returns the Ok value of self.
   *
   * This function can be used for control flow based on result values.
   *
   * @template F
   * @param {(e:E)=>Result<T, F>} op
   * @returns {Result<T, F>}
   * @memberof Result
   */
  orElse<F>(op:(e:E)=>Result<T, F>):Result<T, F>

  /**
   * Unwraps a result, yielding the content of an Ok. Else, it returns optb.
   *
   * @param {T} optb
   * @returns {T}
   * @memberof Result
   */
  unwrapOr(optb:T):T

  /**
   * Unwraps a result, yielding the content of an Ok. If the value is an Err then it calls op with its value.
   *
   * @param {(e:E)=>T} op
   * @returns {T}
   * @memberof Result
   */
  unwrapOrElse(op:(e:E)=>T):T

  /**
   * Unwraps a result, yielding the content of an Ok.
   *
   * Throws Error if the value is an Err, with a error message provided by the Err's value.
   *
   * @returns {T}
   * @memberof Result
   */
  unwrap():T

  /**
   * Unwraps a result, yielding the content of an Ok.
   *
   * Throws Error if the value is an Err, with a error message including the passed message, and the content of the Err.
   *
   * @param {string} msg
   * @returns {T}
   * @memberof Result
   */
  expect(msg:string):T

  /**
   * Unwraps a result, yielding the content of an Err.
   *
   * Throws Error if the value is an Ok, with a custom error message provided by the Ok's value.
   *
   * @returns {E}
   * @memberof Result
   */
  unwrapErr():E

  /**
   * Unwraps a result, yielding the content of an Err.
   *
   * Throws Error if the value is an Ok, with a error message including the passed message, and the content of the Ok.
   *
   * @param {string} msg
   * @returns {E}
   * @memberof Result
   */
  expectErr(msg:string):E

  /**
   * Transposes a Result of an Option into an Option of a Result.
   *
   * Ok(None) will be mapped to None. Ok(Some(_)) and Err(_) will be mapped to Some(Ok(_)) and Some(Err(_)).
   *
   * @returns {Option<Result<T, E>>}
   * @memberof Result
   */
  transpose():Option<Result<T, E>>
  /** rust method above */

  // helper method
  /**
   * return true if Result's value equals to resb's.
   *
   * @param {Result<T, E>} resb
   * @param {boolean} [deep]
   * @returns {boolean}
   * @memberof Result
   */
  equal(resb:Result<T, E>, deep?:boolean):boolean

  /**
   * return true if Result's value matches to resb's
   *
   * @param {Option<T>} resb
   * @param {boolean} [deep]
   * @returns {boolean}
   * @memberof Result
   */
  match(resb:Result<T, E>, deep?:boolean):boolean
}