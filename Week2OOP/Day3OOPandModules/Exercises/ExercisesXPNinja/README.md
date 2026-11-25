# Exercises XP Ninja — Dunder Methods 🧠🪄

<div align="center">

<img src="../../../../assets/readme/folder-pulse.svg" width="100%" alt="Animated learning pulse">

<img src="../../../../assets/readme/progress/exercises-xpninja-efd1a61847.svg" width="100%" alt="Progress card for Exercises XPNinja">

</div>

Both Ninja exercises are in `exercisesxpninjadunder.py`.

## Exercise 1 — Temperature
- Canonical storage in Kelvin for a **single source of truth**.
- Subclasses: `Celsius`, `Kelvin`, `Fahrenheit`.
- Clean conversions and **dunder methods**:
  - Ordering (`<, ==`) via Kelvin
  - `__add__/__sub__` with numeric deltas (Kelvin)
  - `t1 - t2` returns delta (Kelvin, float)
  - `__str__/__repr__` give readable forms
- Adding a new scale only needs a new subclass.

## Exercise 2 — Quantum Realm
- `QuantumParticle(x, p, label=None)` with measurement methods:
  - `position()` → int [1..10000]
  - `momentum()` → float [0..1)
  - `spin()` → ±1/2 (stored as ±0.5)
- Every measurement triggers a disturbance of `(x, p)` and prints **"Quantum Interferences!!"**.
- `entangle(other)` links two particles so a spin measurement sets opposite spins; prints **"Spooky Action at a Distance !!"**.
- `__repr__` shows label, x, p, spin, and entanglement status.

## Run
```bash
python exercisesxpninjadunder.py
```
The `__main__` block runs short demos for both exercises.
