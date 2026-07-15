"""
File: exercisesxpninjadunder.py
Purpose: Single-file solutions for "Exercises XP Ninja — Dunder Methods". 🧠🪄
Author: Kevin "Lirioth" Cusnir
Date: 2025-10-11 | TZ: Asia/Jerusalem

Exercises:
  1) Temperature hierarchy with clean conversions (SOLID-friendly) + rich dunders.
  2) QuantumParticle with disturbance, spin measurement, and entanglement.

Notes:
  - Comments/docstrings in ENGLISH. Emojis included.
  - Filenames are lowercase with no underscores.
"""

from __future__ import annotations

from dataclasses import dataclass
from functools import total_ordering
from typing import Type, Optional
import random


# =====================================
# Exercise 1 — Temperature (with dunder)
# =====================================

@total_ordering
class Temperature:
    """Abstract temperature value stored canonically in Kelvin.

    Design choices (SOLID):
    - Single Source of Truth: Internally only Kelvin is stored.
    - Open/Closed: New scales can subclass (override .unit and class converters).
    - Liskov: All subclasses behave as Temperature; comparisons/ops use Kelvin.
    - Interface Segregation: Minimal interface (convert, compare, format).
    - Dependency Inversion: Converters are static/class methods, not hard-coded users.

    Arithmetic:
    - Adding/subtracting a *numeric* value treats it as a temperature *delta in Kelvin*.
    - Subtracting another Temperature returns the delta in Kelvin (float).
    """

    unit: str = "K"

    # ------- Construction -------
    def __init__(self, kelvin: float) -> None:
        if kelvin < 0:
            raise ValueError("Kelvin cannot be negative.")
        self._kelvin = float(kelvin)

    # ------- Core API -------
    @property
    def kelvin(self) -> float:
        return self._kelvin

    # ----- Converters (base uses Kelvin as source) -----
    @staticmethod
    def k_to_c(k: float) -> float:
        return k - 273.15

    @staticmethod
    def k_to_f(k: float) -> float:
        return Temperature.c_to_f(Temperature.k_to_c(k))

    @staticmethod
    def c_to_k(c: float) -> float:
        return c + 273.15

    @staticmethod
    def f_to_k(f: float) -> float:
        return Temperature.c_to_k(Temperature.f_to_c(f))

    @staticmethod
    def c_to_f(c: float) -> float:
        return c * 9/5 + 32

    @staticmethod
    def f_to_c(f: float) -> float:
        return (f - 32) * 5/9

    # ----- Factory helpers -----
    @classmethod
    def from_celsius(cls, c: float) -> "Temperature":
        return cls(Temperature.c_to_k(c))

    @classmethod
    def from_fahrenheit(cls, f: float) -> "Temperature":
        return cls(Temperature.f_to_k(f))

    @classmethod
    def from_kelvin(cls, k: float) -> "Temperature":
        return cls(k)

    # ----- Conversion to instances -----
    def to(self, target: Type["Temperature"]) -> "Temperature":
        """Convert to another Temperature subclass instance."""
        if target is Kelvin:
            return Kelvin(self.kelvin)
        if target is Celsius:
            return Celsius(self.kelvin)
        if target is Fahrenheit:
            return Fahrenheit(self.kelvin)
        raise TypeError("Unknown target Temperature subclass.")

    # ----- Numeric protocol / comparisons -----
    def __float__(self) -> float:
        """Return the Kelvin value as float."""
        return self.kelvin

    def __eq__(self, other: object) -> bool:
        if isinstance(other, Temperature):
            return abs(self.kelvin - other.kelvin) < 1e-9
        return NotImplemented

    def __lt__(self, other: "Temperature") -> bool:
        if not isinstance(other, Temperature):
            return NotImplemented
        return self.kelvin < other.kelvin

    def __add__(self, delta: float) -> "Temperature":
        """Add a *Kelvin delta* (numeric) to this temperature."""
        if isinstance(delta, (int, float)):
            return self.__class__(self.kelvin + float(delta))
        return NotImplemented

    __radd__ = __add__

    def __sub__(self, other):
        """t - number => subtract Kelvin delta and return a new instance.
        t1 - t2 => return difference in Kelvin as float.
        """
        if isinstance(other, (int, float)):
            return self.__class__(self.kelvin - float(other))
        if isinstance(other, Temperature):
            return float(self.kelvin - other.kelvin)
        return NotImplemented

    # ----- String representations -----
    def __repr__(self) -> str:
        return f"{self.__class__.__name__}({self.kelvin:.2f} K)"

    def __str__(self) -> str:
        # Pretty-print in the subclass's unit
        if isinstance(self, Celsius):
            return f"{self.as_celsius():.2f} °C"
        if isinstance(self, Fahrenheit):
            return f"{self.as_fahrenheit():.2f} °F"
        return f"{self.kelvin:.2f} K"

    # ----- Accessors in various units (read-only) -----
    def as_celsius(self) -> float:
        return self.k_to_c(self.kelvin)

    def as_fahrenheit(self) -> float:
        return self.k_to_f(self.kelvin)

    def as_kelvin(self) -> float:
        return self.kelvin


class Celsius(Temperature):
    unit = "°C"
    def __init__(self, source_kelvin_or_celsius: float, *, _is_kelvin: bool = True) -> None:
        k = source_kelvin_or_celsius if _is_kelvin else Temperature.c_to_k(source_kelvin_or_celsius)
        super().__init__(k)

    # Convenience constructors
    @classmethod
    def from_value(cls, celsius: float) -> "Celsius":
        return cls(celsius, _is_kelvin=False)


class Kelvin(Temperature):
    unit = "K"
    def __init__(self, kelvin: float) -> None:
        super().__init__(kelvin)


class Fahrenheit(Temperature):
    unit = "°F"
    def __init__(self, source_kelvin_or_fahrenheit: float, *, _is_kelvin: bool = True) -> None:
        k = source_kelvin_or_fahrenheit if _is_kelvin else Temperature.f_to_k(source_kelvin_or_fahrenheit)
        super().__init__(k)

    @classmethod
    def from_value(cls, fahrenheit: float) -> "Fahrenheit":
        return cls(fahrenheit, _is_kelvin=False)


# Demos for Exercise 1
def _demo_temperature() -> None:
    print("\n>>> Temperature demo")
    t_c = Celsius.from_value(25)          # 25 °C
    t_f = t_c.to(Fahrenheit)              # convert
    t_k = t_c.to(Kelvin)
    print("t_c:", t_c, "| t_f:", t_f, "| t_k:", t_k)
    print("ordering:", Kelvin(300) > Celsius.from_value(20))
    print("delta add/sub:", (t_c + 10), (t_c - 10))      # Kelvin deltas
    print("difference Kelvin:", Kelvin(310) - Kelvin(300))


# ============================================
# Exercise 2 — Quantum Realm (with dunders) 🌀
# ============================================

class QuantumParticle:
    """A tiny toy model of a quantum particle.

    Attributes:
        x (int): internal position-like state
        p (float): internal momentum-like state
        spin_state (Optional[float]): ±0.5 when set, else None
        label (str): human-friendly name (p1, p2, ...)
        entangled_with (Optional[QuantumParticle]): partner if entangled

    Measurement methods:
        position()  -> int in [1, 10000]
        momentum()  -> float in [0.0, 1.0)
        spin()      -> ±0.5

    Each measurement triggers a disturbance (randomize x and p) and prints
    “Quantum Interferences!!”. Entanglement enforces opposite spins upon spin
    measurement of either partner.
    """

    _counter = 0

    def __init__(self, *, x: Optional[int] = None, p: Optional[float] = None, label: Optional[str] = None) -> None:
        QuantumParticle._counter += 1
        self.label = label or f"p{QuantumParticle._counter}"
        self.x: int = x if x is not None else random.randint(1, 10_000)
        self.p: float = p if p is not None else random.random()
        self.spin_state: Optional[float] = None
        self.entangled_with: Optional["QuantumParticle"] = None

    # ---------- Measurements ----------
    def position(self) -> int:
        measured = random.randint(1, 10_000)
        self._disturbance()
        return measured

    def momentum(self) -> float:
        measured = random.random()
        self._disturbance()
        return measured

    def spin(self) -> float:
        # Collapse local spin
        value = random.choice([0.5, -0.5])
        self.spin_state = value

        # Enforce entangled partner's opposite spin if present
        partner = self.entangled_with
        if partner is not None and isinstance(partner, QuantumParticle):
            partner.spin_state = -value

        self._disturbance()
        return value

    # ---------- Entanglement ----------
    def entangle(self, other: "QuantumParticle") -> str:
        if not isinstance(other, QuantumParticle):
            raise TypeError("Can only entangle with another QuantumParticle.")
        if other is self:
            raise ValueError("A particle cannot be entangled with itself.")
        self.entangled_with = other
        other.entangled_with = self
        print("Spooky Action at a Distance !!")
        return f"Particle {self.label} is now in quantum entanglement with Particle {other.label}"

    # ---------- Internals ----------
    def _disturbance(self) -> None:
        # New random internal states for x and p
        self.x = random.randint(1, 10_000)
        self.p = random.random()
        print("Quantum Interferences!!")  # required message

    # ---------- Dunders ----------
    def __repr__(self) -> str:
        s = f"{self.spin_state:+.1f}" if self.spin_state is not None else "?"
        ent = self.entangled_with.label if self.entangled_with else "None"
        return f"QuantumParticle(label={self.label!r}, x={self.x}, p={self.p:.3f}, spin={s}, entangled_with={ent})"


# Demos for Exercise 2
def _demo_quantum() -> None:
    print("\n>>> Quantum demo")
    p1 = QuantumParticle(x=1, p=5.0, label="p1")
    p2 = QuantumParticle(x=2, p=5.0, label="p2")
    print(p1.entangle(p2))
    s1 = p1.spin()  # triggers disturbance, sets partner to opposite
    print("p1 spin:", s1, "p2 spin:", p2.spin_state)
    print(p1)
    print(p2)


# ==============
# Tiny demos ✅
# ==============
if __name__ == "__main__":
    _demo_temperature()
    _demo_quantum()
