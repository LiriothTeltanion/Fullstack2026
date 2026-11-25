import {
  processValue,
  sumNumbersInArray,
  introduceAdvancedUser,
  welcomeUser,
} from "./requiredGold.ts";
console.log("Currency:", processValue(42));
console.log("Reversed:", processValue("TypeScript"));
console.log("Mixed sum:", sumNumbersInArray([10, "20", 5, null]));
console.log(introduceAdvancedUser({ name: "Kevin", age: 25 }));
console.log(introduceAdvancedUser({ name: "Dana", age: 30, address: "12 Example Street" }));
console.log(welcomeUser("Kevin"));
console.log(welcomeUser("Dana", "Welcome"));
