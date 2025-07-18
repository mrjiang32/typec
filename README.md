# TypeC - Type Checking Utilities

A comprehensive JavaScript runtime type checking and validation library that provides safe, reliable type enforcement with detailed error handling.

## Overview

TypeC is a lightweight utility module designed to bring runtime type safety to JavaScript applications. It provides a complete suite of type checking functions that go beyond JavaScript's basic `typeof` operator, offering null-safety, array validation, and comprehensive error reporting.

## Features

- 🛡️ **Runtime Type Safety**: Comprehensive type checking with null/undefined protection
- 🎯 **Precise Validation**: Distinguishes between null, undefined, and NaN values
- 📋 **Array Type Checking**: Validate all elements in arrays match expected types
- 🔗 **Batch Validation**: Check multiple values simultaneously
- 💥 **Detailed Error Messages**: Clear, actionable error information
- 🚀 **Zero Dependencies**: Lightweight and fast
- 📦 **ES6 Modules**: Modern module system support

## Installation

```javascript
import typec from "./typec.js";
```

## API Reference

### Core Type Checking

#### `type_check(value, expectedType)`
Performs type checking while ensuring the value is not null/undefined/NaN.

```javascript
typec.type_check("hello", "string");   // true
typec.type_check(42, "number");        // true
typec.type_check(null, "string");      // false
typec.type_check(undefined, "number"); // false
typec.type_check({}, "object");        // true
typec.type_check([], "object");        // true (arrays are objects)
```
* If you want to check an array, please use `Array.isArray` function.

**Parameters:**
- `value` - The value to check
- `expectedType` - Expected type name ("string", "number", "object", "function", etc.)

**Returns:** `boolean` - True if value matches type and is not null/undefined/NaN

#### `is_null(value)`
Checks if a value is null, undefined, or NaN.

```javascript
typec.is_null(null);        // true
typec.is_null(undefined);   // true
typec.is_null(NaN);         // true
typec.is_null("");          // false (empty string is not null)
typec.is_null(0);           // false (zero is not null)
typec.is_null(false);       // false (false is not null)
```

**Returns:** `boolean` - True if value is null, undefined, or NaN

#### `check_all(...values)`
Checks if all provided arguments are not null/undefined/NaN.

```javascript
typec.check_all("hello", 42, {});     // true (all values are valid)
typec.check_all("hello", null, {});   // false (second value is null)
typec.check_all();                    // true (no arguments = all valid)
typec.check_all(undefined, NaN);      // false (both values are invalid)
```

**Returns:** `boolean` - True if all arguments are valid (non-null)

### Type Enforcement

#### `ensure_type(value, expectedType, errorMessage?)`
Ensures a value is of the expected type, throws TypeError if not.

```javascript
typec.ensure_type("hello", "string");  // "hello" (returns the value)
typec.ensure_type(42, "string");       // throws TypeError

// With custom error message
typec.ensure_type(null, "object", "User data invalid:");  
// throws TypeError: "User data invalid: Expected type object, but got object"
```

**Parameters:**
- `value` - The value to check
- `expectedType` - Expected type name
- `errorMessage` - Optional custom error message prefix

**Returns:** The original value if type check passes
**Throws:** `TypeError` when value doesn't match expected type

#### `ensure_type_all(...typeValuePairs)`
Ensures multiple values match their expected types.

```javascript
typec.ensure_type_all(
  { type: "string", value: "hello" },
  { type: "number", value: 42 },
  { type: "object", value: {} }
); // All pass, no error

typec.ensure_type_all(
  { type: "string", value: "hello" },
  { type: "number", value: "not a number" }
); // throws TypeError for second argument
```

**Parameters:** Objects with `type` and `value` properties
**Throws:** `TypeError` when any argument format is invalid or type check fails

#### `ensure_type_array(array, expectedType)`
Ensures all items in an array are of the expected type.

```javascript
typec.ensure_type_array(["hello", "world"], "string");  // ["hello", "world"]
typec.ensure_type_array([1, 2, 3], "number");           // [1, 2, 3]
typec.ensure_type_array([{}, {a: 1}], "object");        // [{}, {a: 1}]

// Error cases
typec.ensure_type_array("not an array", "string");      // throws TypeError
typec.ensure_type_array([1, "two", 3], "number");       // throws TypeError
```

**Returns:** The original array if all type checks pass
**Throws:** `TypeError` when array is invalid or contains wrong types

## Usage Examples

### Function Parameter Validation

```javascript
function createUser(name, age, email) {
  typec.ensure_type(name, "string", "Name must be a string:");
  typec.ensure_type(age, "number", "Age must be a number:");
  typec.ensure_type(email, "string", "Email must be a string:");
  
  return { name, age, email };
}

// Usage
try {
  const user = createUser("John", 30, "john@example.com");
} catch (error) {
  console.error("Invalid user data:", error.message);
}
```

### Batch Validation

```javascript
function processApiData(data) {
  // Validate multiple fields at once
  typec.ensure_type_all(
    { type: "string", value: data.username },
    { type: "number", value: data.userId },
    { type: "object", value: data.profile },
    { type: "boolean", value: data.isActive }
  );
  
  return processValidData(data);
}
```

### Array Processing

```javascript
function calculateAverage(numbers) {
  typec.ensure_type_array(numbers, "number");
  
  if (numbers.length === 0) {
    throw new Error("Cannot calculate average of empty array");
  }
  
  return numbers.reduce((sum, num) => sum + num, 0) / numbers.length;
}

// Usage
const scores = [85, 92, 78, 96];
const average = calculateAverage(scores); // 87.75
```

### Safe Property Access

```javascript
function getNestedProperty(obj, path) {
  typec.ensure_type(obj, "object", "Object required:");
  typec.ensure_type_array(path, "string");
  
  return path.reduce((current, key) => {
    if (!typec.type_check(current, "object")) {
      return undefined;
    }
    return current[key];
  }, obj);
}

// Usage
const data = { user: { profile: { name: "John" } } };
const name = getNestedProperty(data, ["user", "profile", "name"]); // "John"
```

### Configuration Validation

```javascript
function initializeApp(config) {
  // Check if all required config properties exist and have correct types
  if (!typec.check_all(
    config.apiUrl,
    config.timeout,
    config.debug,
    config.features
  )) {
    throw new Error("Invalid configuration: missing required properties");
  }
  
  typec.ensure_type_all(
    { type: "string", value: config.apiUrl },
    { type: "number", value: config.timeout },
    { type: "boolean", value: config.debug },
    { type: "object", value: config.features }
  );
  
  // Configuration is valid, proceed with initialization
  return startApplication(config);
}
```

### Form Validation

```javascript
function validateForm(formData) {
  const errors = [];
  
  // Check required fields
  if (!typec.type_check(formData.name, "string") || formData.name.trim() === "") {
    errors.push("Name is required and must be a string");
  }
  
  if (!typec.type_check(formData.email, "string")) {
    errors.push("Email must be a string");
  }
  
  if (!typec.type_check(formData.age, "number") || formData.age < 0) {
    errors.push("Age must be a positive number");
  }
  
  // Validate optional arrays
  if (formData.tags && !Array.isArray(formData.tags)) {
    errors.push("Tags must be an array");
  } else if (formData.tags) {
    try {
      typec.ensure_type_array(formData.tags, "string");
    } catch (error) {
      errors.push("All tags must be strings");
    }
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
}
```

## Error Handling

TypeC provides detailed error messages to help with debugging:

```javascript
// TypeError: Type mismatch: Expected type string, but got number
typec.ensure_type(42, "string");

// TypeError: Name must be valid: Expected type string, but got object
typec.ensure_type(null, "string", "Name must be valid:");

// TypeError: Expected an array, but got string
typec.ensure_type_array("not an array", "string");

// TypeError: Each argument must be an object with 'type' and 'value' properties
typec.ensure_type_all({ value: "hello" }); // missing 'type'
```

## Type Safety Patterns

### Guard Functions

```javascript
function isString(value) {
  return typec.type_check(value, "string");
}

function isValidUser(obj) {
  return typec.type_check(obj, "object") &&
         typec.type_check(obj.name, "string") &&
         typec.type_check(obj.age, "number");
}
```

### Type Assertion Helpers

```javascript
function assertString(value, name = "value") {
  return typec.ensure_type(value, "string", `${name} must be a string:`);
}

function assertPositiveNumber(value, name = "value") {
  const num = typec.ensure_type(value, "number", `${name} must be a number:`);
  if (num < 0) {
    throw new Error(`${name} must be positive`);
  }
  return num;
}
```

### Safe Converters

```javascript
function safeParseInt(value) {
  if (typec.type_check(value, "number")) {
    return Math.floor(value);
  }
  
  if (typec.type_check(value, "string")) {
    const parsed = parseInt(value, 10);
    if (typec.is_null(parsed)) {
      throw new Error("Invalid number string");
    }
    return parsed;
  }
  
  throw new TypeError("Value must be a number or string");
}
```

## Performance Considerations

- **Fast Checks**: `type_check` and `is_null` are optimized for common cases
- **Early Returns**: Functions return immediately on first failure
- **Minimal Overhead**: Type checking adds minimal runtime cost
- **Batch Operations**: Use `ensure_type_all` for multiple validations

## Best Practices

1. **Validate Early**: Check types at function boundaries
2. **Use Descriptive Messages**: Provide context in error messages
3. **Combine with Defaults**: Use with default value utilities
4. **Document Expectations**: Clear JSDoc comments about expected types
5. **Handle Errors Gracefully**: Always catch and handle TypeErrors

## Integration with Other Modules

TypeC works well with other utility modules:

```javascript
import typec from "./typec.js";
import nothing from "./nothing.js";

function processConfig(userConfig) {
  // Validate input
  typec.ensure_type(userConfig, "object", "Config must be an object:");
  
  // Set defaults for missing values
  const config = nothing.deep_merge(defaultConfig, userConfig);
  
  // Validate final config
  typec.ensure_type_all(
    { type: "string", value: config.apiUrl },
    { type: "number", value: config.timeout },
    { type: "boolean", value: config.debug }
  );
  
  return config;
}
```

## Browser Compatibility

- Modern browsers (ES6+)
- Node.js 12+
- Any environment with ES6 module support

## Contributing

When adding new type checking functions:

1. Follow existing naming conventions
2. Add comprehensive JSDoc documentation
3. Include multiple usage examples
4. Provide clear error messages
5. Add to the export object
---

*TypeC is part of the HuaBot project utilities, designed for production-ready type safety in JavaScript applications.*
