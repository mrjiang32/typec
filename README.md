# Type Checking Utilities (`typec.js`)

A lightweight JavaScript library for runtime type checking and validation with comprehensive error handling.

## Features

- Type checking with null/undefined validation
- NaN detection
- Type enforcement with descriptive errors
- Array type validation
- Truthy/falsy checks
- Strict boolean verification

## Installation

```javascript
import typec from './typec.js';
```

## API Reference

### Core Functions

#### `type_check(obj, ctype)`
Checks if a value matches the expected type and is not null/undefined.

```javascript
typec.type_check("hello", "string"); // true
typec.type_check(null, "number");   // false
```

#### `is_null(obj)`
Detects null, undefined, or NaN values.

```javascript
typec.is_null(undefined); // true
typec.is_null(NaN);       // true
typec.is_null(0);         // false
```

#### `check_all(...args)`
Validates that all arguments are non-null.

```javascript
typec.check_all("a", 1, {}); // true
typec.check_all("a", null);  // false
```

### Type Enforcement

#### `ensure_type(obj, ctype, error_message)`
Throws TypeError if value doesn't match expected type.

```javascript
typec.ensure_type(42, "number"); // returns 42
typec.ensure_type("42", "number"); // throws TypeError
```

#### `ensure_type_all(...args)`
Validates multiple values against their expected types.

```javascript
typec.ensure_type_all(
  { type: "string", value: "hello" },
  { type: "number", value: 42 }
);
```

#### `ensure_type_array(arr, ctype)`
Ensures all array elements match the specified type.

```javascript
typec.ensure_type_array([1, 2, 3], "number"); // returns [1, 2, 3]
typec.ensure_type_array([1, "2"], "number");  // throws TypeError
```

### Boolean Helpers

#### `truthy(value)`
Checks for truthy values (excluding false, 0, "", etc.).

```javascript
typec.truthy("hello"); // true
typec.truthy(0);       // false
```

#### `falsy(value)`
Checks for falsy values.

```javascript
typec.falsy("");      // true
typec.falsy("hello"); // false
```

#### `is_true(value)`
Strict true check.

```javascript
typec.is_true(true);  // true
typec.is_true(1);     // false
```

## Examples

```javascript
// Function parameter validation
function createUser(name, age) {
  typec.ensure_type(name, "string", "Name must be a string");
  typec.ensure_type(age, "number", "Age must be a number");
  // ... implementation
}

// Array validation
const numbers = typec.ensure_type_array([1, 2, 3], "number");

// Multiple validations
typec.ensure_type_all(
  { type: "string", value: username },
  { type: "object", value: userData }
);
```

## License

MIT © Andrew M. Pines
Some parts of `README.md` were writtern by AIs. There may be several mistakes.
