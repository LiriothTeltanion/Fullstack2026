import test from "node:test";
import assert from "node:assert/strict";
import { calculate, initialState, keyboardAction, transition } from "../src/calculator.js";

function sequence(keys) {
  return [...keys].reduce((state, key) => transition(state, keyboardAction(key)), initialState());
}

test("all four operations use real keypad transitions", () => {
  for (const [keys, expected] of [
    ["12+3=", "15"],
    ["9-12=", "-3"],
    ["7*8=", "56"],
    ["9/4=", "2.25"],
  ]) {
    assert.equal(sequence(keys).display, expected, keys);
  }
});

test("decimal input removes noise and ignores duplicate decimal points", () => {
  assert.equal(sequence("0.1+0.2=").display, "0.3");
  assert.equal(sequence("1..25+0.5=").display, "1.75");
  assert.equal(sequence(".5+.25=").display, "0.75");
});

test("immediate chaining and replacement of a pending operator", () => {
  assert.equal(sequence("2+3*4=").display, "20");
  assert.equal(sequence("8+-2=").display, "6");
  assert.equal(sequence("3+=").display, "3");
  assert.equal(sequence("3=").display, "3");
});

test("results can continue or start a fresh number", () => {
  assert.equal(sequence("2+3=*4=").display, "20");
  assert.equal(sequence("2+3=7").display, "7");
  assert.equal(sequence("2+3=.5").display, "0.5");
  assert.equal(sequence("2+3==").display, "5");
});

test("division by zero resets pending state and permits recovery", () => {
  const failed = sequence("8/0=");
  assert.match(failed.error, /zero/);
  assert.equal(failed.accumulator, null);
  assert.equal(failed.operator, null);
  assert.equal(transition(failed, { type: "digit", value: "2" }).display, "2");
  assert.equal(transition(failed, { type: "decimal" }).display, "0.");
  assert.deepEqual(transition(failed, { type: "clear" }), initialState());
});

test("editing and sign changes preserve other state", () => {
  let state = sequence("123");
  state = transition(state, { type: "backspace" });
  assert.equal(state.display, "12");
  state = transition(state, { type: "sign" });
  assert.equal(state.display, "-12");
  assert.equal(transition(state, { type: "sign" }).display, "12");
  assert.equal(transition(sequence("1"), { type: "backspace" }).display, "0");
  assert.equal(transition(initialState(), { type: "sign" }).display, "0");
  const negativeOperand = transition(sequence("8+"), { type: "sign" });
  const entered = transition(negativeOperand, { type: "digit", value: "2" });
  assert.equal(entered.display, "-2");
  assert.equal(transition(entered, { type: "equals" }).display, "6");
});

test("input bound, leading zeros and unsupported actions", () => {
  assert.equal(sequence("00012").display, "12");
  assert.equal(sequence("12345678901234567").display, "1234567890123456");
  const state = sequence("12");
  assert.equal(transition(state, { type: "digit", value: "unsafe" }), state);
  assert.equal(transition(state, { type: "operator", value: "unknown" }), state);
  assert.equal(keyboardAction("Delete"), null);
  assert.equal(keyboardAction("Enter").type, "equals");
  assert.equal(keyboardAction("Escape").type, "clear");
});

test("relative precision retains small values and safe integers", () => {
  assert.equal(calculate(0.0000001, 10, "divide").result, 0.00000001);
  assert.equal(calculate(9007199254740990, 1, "add").result, 9007199254740991);
  assert.equal(calculate(-0, 1, "multiply").result, 0);
});

test("overflow, invalid operation and non-finite operands are controlled", () => {
  assert.match(calculate(Number.MAX_VALUE, 2, "multiply").error, /range/);
  assert.ok(calculate(Infinity, 1, "add").error);
  assert.ok(calculate(1, NaN, "add").error);
  assert.ok(calculate(1, 2, "unknown").error);
  const state = {
    ...initialState(),
    accumulator: Number.MAX_VALUE,
    operator: "multiply",
    display: "2",
  };
  assert.equal(transition(state, { type: "equals" }).display, "Error");
});
