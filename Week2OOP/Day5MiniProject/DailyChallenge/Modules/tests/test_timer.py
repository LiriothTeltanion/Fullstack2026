
import unittest
from unittest import mock
from types import SimpleNamespace

import timer

class MockResp:
    def __init__(self, status=200, chunks=None):
        self.status_code = status
        self._chunks = chunks or [b'hello', b'world']

    def raise_for_status(self):
        if self.status_code >= 400:
            raise Exception(f"HTTP {self.status_code}")

    def iter_content(self, chunk_size=65536):
        for c in self._chunks:
            yield c

    def __enter__(self):
        return self

    def __exit__(self, exc_type, exc, tb):
        return False

class MockSession:
    def __enter__(self):
        return self

    def __exit__(self, exc_type, exc, tb):
        return False

    def get(self, url, stream=True, timeout=15, verify=True):
        return MockResp(status=200, chunks=[b'a'*10, b'b'*5])

class TestTimer(unittest.TestCase):
    @mock.patch('timer.requests.Session', return_value=MockSession())
    def test_measure_load_time_success(self, _):
        r = timer.measure_load_time("https://example.com")
        self.assertTrue(r["ok"])
        self.assertEqual(r["bytes"], 15)
        self.assertEqual(r["status"], 200)
        self.assertIn("elapsed_s", r)
        self.assertIsNone(r["error"])

    @mock.patch('timer.requests.Session', return_value=MockSession())
    def test_benchmark_wrapper(self, _):
        rep = timer.benchmark(["example.com"], attempts=2)
        self.assertIn("https://example.com", rep)
        res = rep["https://example.com"]
        self.assertEqual(res["attempts"], 2)
        self.assertEqual(res["bytes_samples"], [15, 15])

if __name__ == '__main__':
    unittest.main()
