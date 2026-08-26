/**
 * Daily Challenge: Union Type Validator
 * Last Updated: October 8th, 2025
 *
 * What You'll Learn:
 * - How to create a function using union types to validate variable types
 * - How to compare the type of a value against a list of allowed types
 * - How to use loops in TypeScript to iterate through an array of allowed types
 * - How to use TypeScript's typeof operator for type checking
 */

/**
 * Validates if a value's type matches one of the allowed types
 *
 * @param value - The value to validate
 * @param allowedTypes - Array of allowed type names (e.g., ['string', 'number', 'boolean'])
 * @returns true if the value type is in allowedTypes, false otherwise
 */
function validateUnionType(value: any, allowedTypes: string[]): boolean {
  // Get the actual type of the value using typeof operator
  const valueType = typeof value;

  // Iterate through the array of allowed types
  for (const allowedType of allowedTypes) {
    // Check if the value's type matches any of the allowed types
    if (valueType === allowedType) {
      return true;
    }
  }

  // If no match found, return false
  return false;
}

/**
 * Alternative implementation using array methods
 */
function validateUnionTypeAlt(value: any, allowedTypes: string[]): boolean {
  const valueType = typeof value;
  return allowedTypes.includes(valueType);
}

// ============================================
// DEMONSTRATION & TEST CASES
// ============================================

console.log("=".repeat(60));
console.log("🔍 UNION TYPE VALIDATOR - DEMONSTRATION");
console.log("=".repeat(60));
console.log();

// Test Case 1: String validation
console.log("📝 Test Case 1: String Validation");
const name: string = "Alice";
const isValidString = validateUnionType(name, ["string", "number"]);
console.log(`Value: "${name}"`);
console.log(`Type: ${typeof name}`);
console.log(`Allowed Types: ["string", "number"]`);
console.log(`✅ Is Valid: ${isValidString}`);
console.log();

// Test Case 2: Number validation
console.log("🔢 Test Case 2: Number Validation");
const age: number = 25;
const isValidNumber = validateUnionType(age, ["number", "bigint"]);
console.log(`Value: ${age}`);
console.log(`Type: ${typeof age}`);
console.log(`Allowed Types: ["number", "bigint"]`);
console.log(`✅ Is Valid: ${isValidNumber}`);
console.log();

// Test Case 3: Boolean validation (FAIL case)
console.log("❌ Test Case 3: Boolean Validation (Expected to Fail)");
const isActive: boolean = true;
const isValidBoolean = validateUnionType(isActive, ["string", "number"]);
console.log(`Value: ${isActive}`);
console.log(`Type: ${typeof isActive}`);
console.log(`Allowed Types: ["string", "number"]`);
console.log(`❌ Is Valid: ${isValidBoolean}`);
console.log();

// Test Case 4: Object validation
console.log("🏷️  Test Case 4: Object Validation");
const person = { name: "Bob", age: 30 };
const isValidObject = validateUnionType(person, ["object", "function"]);
console.log(`Value:`, person);
console.log(`Type: ${typeof person}`);
console.log(`Allowed Types: ["object", "function"]`);
console.log(`✅ Is Valid: ${isValidObject}`);
console.log();

// Test Case 5: Array validation (arrays are objects in JavaScript)
console.log("📚 Test Case 5: Array Validation");
const colors: string[] = ["red", "green", "blue"];
const isValidArray = validateUnionType(colors, ["object"]);
console.log(`Value:`, colors);
console.log(`Type: ${typeof colors}`);
console.log(`Allowed Types: ["object"]`);
console.log(`Note: Arrays are objects in JavaScript`);
console.log(`✅ Is Valid: ${isValidArray}`);
console.log();

// Test Case 6: Function validation
console.log("⚙️  Test Case 6: Function Validation");
const greet = () => "Hello!";
const isValidFunction = validateUnionType(greet, ["function"]);
console.log(`Value: () => "Hello!"`);
console.log(`Type: ${typeof greet}`);
console.log(`Allowed Types: ["function"]`);
console.log(`✅ Is Valid: ${isValidFunction}`);
console.log();

// Test Case 7: Undefined validation
console.log("❓ Test Case 7: Undefined Validation");
let undefinedVar: undefined;
const isValidUndefined = validateUnionType(undefinedVar, ["undefined", "null"]);
console.log(`Value: ${undefinedVar}`);
console.log(`Type: ${typeof undefinedVar}`);
console.log(`Allowed Types: ["undefined", "null"]`);
console.log(`✅ Is Valid: ${isValidUndefined}`);
console.log();

// Test Case 8: Multiple type validation
console.log("🎯 Test Case 8: Union Type with Multiple Options");
const userId: string | number = "USR123";
const isValidUserId = validateUnionType(userId, ["string", "number"]);
console.log(`Value: "${userId}"`);
console.log(`Type: ${typeof userId}`);
console.log(`Allowed Types: ["string", "number"]`);
console.log(`✅ Is Valid: ${isValidUserId}`);
console.log();

// Change userId to number and test again
const numericUserId: string | number = 456;
const isValidNumericId = validateUnionType(numericUserId, ["string", "number"]);
console.log(`Value: ${numericUserId}`);
console.log(`Type: ${typeof numericUserId}`);
console.log(`Allowed Types: ["string", "number"]`);
console.log(`✅ Is Valid: ${isValidNumericId}`);
console.log();

// Test Case 9: Strict validation (no matches)
console.log("🚫 Test Case 9: Strict Validation (No Matches)");
const symbol = Symbol("unique");
const isValidSymbol = validateUnionType(symbol, ["string", "number", "boolean"]);
console.log(`Value: Symbol(unique)`);
console.log(`Type: ${typeof symbol}`);
console.log(`Allowed Types: ["string", "number", "boolean"]`);
console.log(`❌ Is Valid: ${isValidSymbol}`);
console.log();

// Test Case 10: BigInt validation
console.log("💯 Test Case 10: BigInt Validation");
const bigNumber: bigint = 9007199254740991n;
const isValidBigInt = validateUnionType(bigNumber, ["bigint", "number"]);
console.log(`Value: ${bigNumber}n`);
console.log(`Type: ${typeof bigNumber}`);
console.log(`Allowed Types: ["bigint", "number"]`);
console.log(`✅ Is Valid: ${isValidBigInt}`);
console.log();

// ============================================
// COMPARISON: Original vs Alternative
// ============================================

console.log("=".repeat(60));
console.log("⚖️  COMPARISON: Loop vs Array Methods");
console.log("=".repeat(60));

const testValue = "test";
const types = ["string", "number"];

console.log(`Testing value: "${testValue}" against types:`, types);
console.log(`Original (loop):      ${validateUnionType(testValue, types)}`);
console.log(`Alternative (includes): ${validateUnionTypeAlt(testValue, types)}`);
console.log();

// ============================================
// PRACTICAL EXAMPLE: Form Validation
// ============================================

console.log("=".repeat(60));
console.log("📋 PRACTICAL EXAMPLE: Form Input Validation");
console.log("=".repeat(60));
console.log();

interface FormField {
  name: string;
  value: any;
  allowedTypes: string[];
}

const formFields: FormField[] = [
  { name: "username", value: "john_doe", allowedTypes: ["string"] },
  { name: "age", value: 28, allowedTypes: ["number"] },
  { name: "isSubscribed", value: true, allowedTypes: ["boolean"] },
  { name: "userId", value: "12345", allowedTypes: ["string", "number"] },
  { name: "invalidField", value: null, allowedTypes: ["string", "number"] },
];

console.log("Validating form fields:");
console.log();

formFields.forEach(field => {
  const isValid = validateUnionType(field.value, field.allowedTypes);
  const status = isValid ? "✅ VALID" : "❌ INVALID";

  console.log(`Field: ${field.name}`);
  console.log(`  Value: ${field.value}`);
  console.log(`  Type: ${typeof field.value}`);
  console.log(`  Allowed: [${field.allowedTypes.join(", ")}]`);
  console.log(`  Status: ${status}`);
  console.log();
});

console.log("=".repeat(60));
console.log("✨ Validation Complete!");
console.log("=".repeat(60));

// Export for potential reuse
export { validateUnionType, validateUnionTypeAlt };
