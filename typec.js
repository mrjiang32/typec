/**
 * @fileoverview Type checking and validation utilities
 * Provides functions for runtime type checking, null/undefined validation,
 * and type enforcement with error handling.
 */

/**
 * Performs type checking while also ensuring the value is not null/undefined
 * @param {*} obj - The value to check
 * @param {string} ctype - The expected type name (e.g., "string", "number", "object", "function")
 * @returns {boolean} True if obj is of the specified type and not null/undefined
 * @example
 * type_check("hello", "string");   // true
 * type_check(42, "number");        // true
 * type_check(null, "string");      // false
 * type_check(undefined, "number"); // false
 * type_check({}, "object");        // true
 * type_check([], "object");        // true (arrays are objects in JavaScript)
 */
function type_check(obj, ctype) {
  return (!is_null(obj)) &&
    typeof ctype === "string" &&
    typeof obj === ctype;
}

/**
 * Checks if a value is null, undefined, or NaN
 * @param {*} obj - The value to check for null/undefined/NaN
 * @returns {boolean} True if the value is null, undefined, or NaN; false otherwise
 * @example
 * is_null(null);        // true
 * is_null(undefined);   // true
 * is_null(NaN);         // true
 * is_null("");          // false (empty string is not null)
 * is_null(0);           // false (zero is not null)
 * is_null(false);       // false (false is not null)
 * is_null({});          // false (empty object is not null)
 */
function is_null(obj) {
  return obj === undefined ||
    obj === null ||
    Number.isNaN(obj);
}

/**
 * Checks if all provided arguments are not null/undefined/NaN
 * @param {...*} args - Any number of values to check
 * @returns {boolean} True if all arguments are not null/undefined/NaN; false if any are
 * @example
 * check_all("hello", 42, {});     // true (all values are valid)
 * check_all("hello", null, {});   // false (second value is null)
 * check_all();                    // true (no arguments = all valid)
 * check_all(undefined, NaN);      // false (both values are invalid)
 */
function check_all(...args) {
  return args.every(arg => !is_null(arg));
}

/**
 * Ensures a value is of the expected type, throws TypeError if not
 * @param {*} obj - The value to check
 * @param {string} ctype - The expected type name
 * @param {string} [error_message="Type mismatch:"] - Custom error message prefix
 * @returns {*} The original value if type check passes
 * @throws {TypeError} When the value is not of the expected type
 * @example
 * ensure_type("hello", "string");  // "hello" (returns the value)
 * ensure_type(42, "string");       // throws TypeError
 * 
 * // With custom error message
 * ensure_type(null, "object", "User data invalid:");  
 * // throws TypeError: "User data invalid: Expected type object, but got object"
 * 
 * // Usage in function parameters
 * function processName(name) {
 *   ensure_type(name, "string", "Name must be a string:");
 *   return name.toUpperCase();
 * }
 */
function ensure_type(obj, ctype, error_message = "Type mismatch:") {
  if (!type_check(obj, ctype)) {
    throw new TypeError(`${error_message} Expected type ${ctype}, but got ${typeof obj}`);
  }
  return obj;
}

/**
 * Ensures multiple values match their expected types
 * @param {...Object} args - Objects with 'type' and 'value' properties
 * @param {string} args.type - The expected type name
 * @param {*} args.value - The value to check
 * @throws {TypeError} When any argument format is invalid or type check fails
 * @example
 * ensure_type_all(
 *   { type: "string", value: "hello" },
 *   { type: "number", value: 42 },
 *   { type: "object", value: {} }
 * ); // All pass, no error
 * 
 * ensure_type_all(
 *   { type: "string", value: "hello" },
 *   { type: "number", value: "not a number" }
 * ); // throws TypeError for second argument
 * 
 * // Invalid argument format
 * ensure_type_all({ value: "hello" }); // throws TypeError (missing 'type')
 */
function ensure_type_all(...args) {
  // `args` should be an array of objects and their expected types
  // like [{type: "string", value: "example"}, {type: "number", value: 42}]

  for (const item of args) {
    if (typeof item !== "object" || !item.type || !item.value) {
      throw new TypeError("Each argument must be an object with 'type' and 'value' properties.");
    }
    ensure_type(item.value, item.type);
  }
}

/**
 * Ensures all items in an array are of the expected type
 * @param {Array} arr - The array to validate
 * @param {string} ctype - The expected type for all array elements
 * @returns {Array} The original array if all type checks pass
 * @throws {TypeError} When arr is not an array or any element fails type check
 * @example
 * ensure_type_array(["hello", "world"], "string");  // ["hello", "world"]
 * ensure_type_array([1, 2, 3], "number");           // [1, 2, 3]
 * ensure_type_array([{}, {a: 1}], "object");        // [{}, {a: 1}]
 * 
 * // Error cases
 * ensure_type_array("not an array", "string");      // throws TypeError (not array)
 * ensure_type_array([1, "two", 3], "number");       // throws TypeError (mixed types)
 * ensure_type_array([null, "hello"], "string");     // throws TypeError (null element)
 * 
 * // Usage in function validation
 * function processNames(names) {
 *   ensure_type_array(names, "string");
 *   return names.map(name => name.toUpperCase());
 * }
 */
function ensure_type_array(arr, ctype) {
  if (!Array.isArray(arr)) {
    throw new TypeError(`Expected an array, but got ${typeof arr}`);
  }
  for (const item of arr) {
    ensure_type(item, ctype);
  }
  return arr;
}

/**
 * Check if a value is truthy (not null, undefined, false, 0, empty string, or NaN)
 * @param {*} value 
 * @returns {Boolean} True if value is truthy, false otherwise
 */
function truthy(value) {
  return value !== null && value !== undefined && value !== false && value !== 0 && value !== "" && !Number.isNaN(value);
}

/**
 * Check if a value is falsy (null, undefined, false, 0, empty string, or NaN)
 * @param {*} value 
 * @returns {Boolean} True if value is falsy (null, undefined, false, 0, empty string, or NaN)
 */
function falsy(value) {
  return !truthy(value);
}

/**
 * Quick check if a value is true (strictly equals true)
 * @param {*} value 
 * @returns {Boolean} True if value is strictly true, false otherwise
 */
function is_true(value) {
  return type_check(value, "boolean") && value === true;
}

/**
 * Type checking utilities module
 * @description Provides functions for runtime type checking, null/undefined validation,
 * and type enforcement with error handling.
 * @author Andrew M. Pines
 * @version 1.0.1
 * @license MIT
 * @namespace
 */
export default Object.freeze({
  /** @type {Function} Check if value matches expected type and is not null */
  type_check,
  /** @type {Function} Check if value is null, undefined, or NaN */
  is_null,
  /** @type {Function} Check if all arguments are not null/undefined/NaN */
  check_all,
  /** @type {Function} Ensure value is of expected type or throw error */
  ensure_type,
  /** @type {Function} Ensure multiple values match their expected types */
  ensure_type_all,
  /** @type {Function} Ensure all array elements are of expected type */
  ensure_type_array,
  /** @type {Function} Check if value is truthy (not null, undefined, false, 0, empty string, or NaN) */
  truthy,
  /** @type {Function} Check if value is falsy (null, undefined, false, 0, empty string, or NaN) */
  falsy,
  /** @type {Function} Quick check if value is strictly true */
  is_true
});
