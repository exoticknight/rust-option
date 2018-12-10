export interface Option<T> {
    /** rust methods below */
    /**
     * Returns true if the option is a Some value.
     *
     * @returns {boolean}
     * @memberof Option
     */
    isSome(): boolean;
    /**
     * Returns true if the option is a None value.
     *
     * @returns {boolean}
     * @memberof Option
     */
    isNone(): boolean;
    /**
     * throw Error if the value is a None with a custom error message provided by msg.
     *
     * @param {string} msg
     * @returns {(T | void)}
     * @memberof Option
     */
    expect(msg: string): T | void;
    /**
     * return the value v out of the Option<T> if it is Some(v).
     *
     * @returns {(T | void)}
     * @memberof Option
     */
    unwrap(): T | void;
    /**
     * Returns the contained value or a placeholder.
     *
     * @param {T} placeholder
     * @returns {T}
     * @memberof Option
     */
    unwrapOr(placeholder: T): T;
    /**
     * Returns the contained value or computes it from a placeholderFn.
     *
     * @param {()=>T} placeholderFn
     * @returns {T}
     * @memberof Option
     */
    unwrapOrElse(placeholderFn: () => T): T;
    /**
     * Maps an Option<T> to Option<U> by applying a function to a contained value.
     *
     * @template U
     * @param {(value:T)=>U} fn
     * @returns {Option<U>}
     * @memberof Option
     */
    map<U>(fn: (value: T) => U): Option<U>;
    /**
     * Applies a function to the contained value (if any), or returns the provided placeholder (if not).
     *
     * @template U
     * @param {U} placeholder
     * @param {(value:T)=>U} fn
     * @returns {U}
     * @memberof Option
     */
    mapOr<U>(placeholder: U, fn: (value: T) => U): U;
    /**
     * Applies a function to the contained value (if any), or computes with placeholderFn (if not).
     *
     * @template U
     * @param {()=>U} placeholderFn
     * @param {(value:T)=>U} fn
     * @returns {U}
     * @memberof Option
     */
    mapOrElse<U>(placeholderFn: () => U, fn: (value: T) => U): U;
    /**
     * Returns None if the option is None, otherwise returns optb.
     *
     * @template U
     * @param {Option<U>} optb
     * @returns {Option<U>}
     * @memberof Option
     */
    and<U>(optb: Option<U>): Option<U>;
    /**
     * Returns None if the option is None, otherwise calls f with the wrapped value and returns the result.
     * You can recognize it as flatMap.
     *
     * @template U
     * @param {(value:T)=>Option<U>} fn
     * @returns {Option<U>}
     * @memberof Option
     */
    andThen<U>(fn: (value: T) => Option<U>): Option<U>;
    /**
     *
     *
     * @param {(value:T)=>boolean} predicate
     * @returns {Option<T>}
     * @memberof Option
     */
    filter(predicate: (value: T) => boolean): Option<T>;
    /**
     * Returns the option if it contains a value, otherwise returns optb.
     *
     * @param {Option<T>} optb
     * @returns {Option<T>}
     * @memberof Option
     */
    or(optb: Option<T>): Option<T>;
    /**
     * Returns the option if it contains a value, otherwise calls f and returns the result.
     *
     * @param {()=>Option<T>} fn
     * @returns {Option<T>}
     * @memberof Option
     */
    orElse(fn: () => Option<T>): Option<T>;
    /**
     * Returns Some if exactly one of self, optb is Some, otherwise returns None.
     *
     * @param {Option<T>} optb
     * @returns {Option<T>}
     * @memberof Option
     */
    xor(optb: Option<T>): Option<T>;
    /** rust methods above */
    /**
     * return true if Option's value is shallow equal to optb's.
     *
     * @param {Option<T>} optb
     * @returns {boolean}
     * @memberof Option
     */
    equal(optb: Option<T>, deep?: boolean): boolean;
}
export declare function Some<T>(value: T): Option<T>;
export declare const None: Option<any>;
export declare function useDeepEqual(): void;
export declare function optionEqual<T>(opta: Option<T>, optb: Option<T>, deep?: boolean): boolean;
export declare type Branch = [Function] | [Option<any>, Function];
export declare function makeMatch<T>(branches: Branch[], deep?: boolean): (opt: Option<T>) => any;
export declare function match<T>(opt: Option<T>, branches: Branch[], deep?: boolean): any;
