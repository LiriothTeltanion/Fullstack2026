import math
import unittest
from _loader import find_one, load_file

mod = load_file("nova_circle", find_one("Week*/**/DailyChallenge/Circle/circle.py"))

class CircleTests(unittest.TestCase):
    def test_radius_diameter_and_area(self):
        circle = mod.Circle(radius=3)
        self.assertEqual(circle.diameter, 6)
        self.assertAlmostEqual(circle.area(), math.pi * 9)
        self.assertEqual(mod.Circle(diameter=8).radius, 4)

    def test_add_compare_sort(self):
        a, b = mod.Circle(radius=2), mod.Circle(radius=5)
        self.assertEqual((a + b).radius, 7)
        self.assertLess(a, b)
        self.assertEqual([c.radius for c in sorted([b, a])], [2, 5])

    def test_rejects_invalid_values(self):
        with self.assertRaises(ValueError):
            mod.Circle(radius=0)
        with self.assertRaises(ValueError):
            mod.Circle()

if __name__ == "__main__":
    unittest.main()
