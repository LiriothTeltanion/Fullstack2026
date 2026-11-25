import { mapType, getProperty, multiplyProperty } from "./requiredNinja.ts";
const product = { name: "Notebook", price: 12.5, available: true };
const name: string = getProperty(product, "name");
const price: number = getProperty(product, "price");
console.log("Square:", mapType(6));
console.log("Length:", mapType("TypeScript"));
console.log("Inferred properties:", name, price);
console.log("Multiplied price:", multiplyProperty(product, "price", 3));
console.log("Original remains:", product.price);
