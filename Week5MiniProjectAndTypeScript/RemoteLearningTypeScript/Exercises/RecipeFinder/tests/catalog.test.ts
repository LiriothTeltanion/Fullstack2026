import { describe, expect, it } from "vitest";
import recipes from "../public/recipes.json";
import { matchesIngredients, parseCatalog } from "../src/catalog";

describe("local recipe boundary", () => {
  it("validates every shipped record and returns independent values", () => {
    const parsed = parseCatalog(recipes);
    expect(parsed).toHaveLength(6);
    expect(parsed[0]).not.toBe(recipes[0]);
    expect(parsed.every(recipe => recipe.steps.length && recipe.minutes > 0)).toBe(true);
  });

  it.each([
    ["non-array root", { recipes }],
    ["duplicate ID", [recipes[0], recipes[0]]],
    ["zero minutes", [{ ...recipes[0], minutes: 0 }]],
    ["string minutes", [{ ...recipes[0], minutes: "15" }]],
    ["fractional servings", [{ ...recipes[0], servings: 1.5 }]],
    ["missing quantity", [{ ...recipes[0], ingredients: [{ name: "lemon" }] }]],
    ["blank step", [{ ...recipes[0], steps: ["  "] }]],
  ])("rejects %s", (_, value) => {
    expect(() => parseCatalog(value)).toThrow();
  });

  it("matches all terms across ingredients and does not search descriptive copy", () => {
    const recipe = parseCatalog(recipes)[0]!;
    expect(matchesIngredients(recipe, "CHICKPEA, lémon")).toBe(true);
    expect(matchesIngredients(recipe, "chickpea rice")).toBe(false);
    expect(matchesIngredients(recipe, "kettle")).toBe(false);
    expect(matchesIngredients(recipe, " , ")).toBe(true);
  });
});
