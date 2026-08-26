import { ESLint } from "eslint";

const expectedCounts = new Map([
  ["@typescript-eslint/no-explicit-any", 39],
  ["@typescript-eslint/no-unused-vars", 22],
  ["no-constant-condition", 3],
  ["no-debugger", 1],
]);

const eslint = new ESLint();
const results = await eslint.lintFiles(["."]);
const actualCounts = new Map();
let warningCount = 0;
let fatalCount = 0;

for (const result of results) {
  warningCount += result.warningCount;

  for (const message of result.messages) {
    if (message.fatal) {
      fatalCount += 1;
    }

    if (message.severity !== 2) {
      continue;
    }

    const ruleId = message.ruleId ?? "<fatal>";
    actualCounts.set(ruleId, (actualCounts.get(ruleId) ?? 0) + 1);
  }
}

const expectedTotal = [...expectedCounts.values()].reduce((total, count) => total + count, 0);
const actualTotal = [...actualCounts.values()].reduce((total, count) => total + count, 0);
const allRuleIds = new Set([...expectedCounts.keys(), ...actualCounts.keys()]);
const mismatches = [...allRuleIds]
  .sort()
  .filter(ruleId => (expectedCounts.get(ruleId) ?? 0) !== (actualCounts.get(ruleId) ?? 0));

if (
  actualTotal !== expectedTotal ||
  warningCount !== 0 ||
  fatalCount !== 0 ||
  mismatches.length > 0
) {
  console.error("ESLint curriculum baseline mismatch.");
  console.error(
    JSON.stringify(
      {
        expected: Object.fromEntries(expectedCounts),
        actual: Object.fromEntries(actualCounts),
        expectedTotal,
        actualTotal,
        warningCount,
        fatalCount,
      },
      null,
      2
    )
  );
  process.exitCode = 1;
} else {
  console.log(
    `ESLint curriculum baseline verified: ${actualTotal} documented findings across ${actualCounts.size} rules.`
  );
}
