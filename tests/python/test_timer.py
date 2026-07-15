import sys
import types
import unittest
from unittest import mock
from _loader import find_one, load_file

fake_requests = types.ModuleType("requests")
fake_requests.Session = lambda: None
sys.modules.setdefault("requests", fake_requests)
mod = load_file("nova_timer", find_one("Week*/**/DailyChallenge/Modules/timer.py"))

class MockResponse:
    status_code = 200
    def raise_for_status(self): return None
    def iter_content(self, chunk_size=65536):
        yield b"a" * 10
        yield b"b" * 5
    def __enter__(self): return self
    def __exit__(self, exc_type, exc, tb): return False

class MockSession:
    def __enter__(self): return self
    def __exit__(self, exc_type, exc, tb): return False
    def get(self, *args, **kwargs): return MockResponse()

class TimerTests(unittest.TestCase):
    @mock.patch.object(mod.requests, "Session", return_value=MockSession())
    def test_measure_and_benchmark(self, _):
        result = mod.measure_load_time("example.com")
        self.assertTrue(result["ok"])
        self.assertEqual(result["bytes"], 15)
        report = mod.benchmark(["example.com"], attempts=2)
        self.assertEqual(report["https://example.com"]["bytes_samples"], [15, 15])

if __name__ == "__main__":
    unittest.main()
