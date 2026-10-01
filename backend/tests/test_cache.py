"""Unit tests for the TTL cache."""

from unittest.mock import patch

from backend.app.services.cache import TTLCache


def test_returns_none_for_missing_key():
    cache: TTLCache[int] = TTLCache(ttl_seconds=60)

    assert cache.get("missing") is None


def test_returns_stored_value_before_expiry():
    cache: TTLCache[int] = TTLCache(ttl_seconds=60)
    cache.set("a", 1)

    assert cache.get("a") == 1


def test_entry_expires_after_ttl():
    cache: TTLCache[int] = TTLCache(ttl_seconds=60)

    with patch("backend.app.services.cache.time.monotonic", return_value=1000.0):
        cache.set("a", 1)

    with patch("backend.app.services.cache.time.monotonic", return_value=1061.0):
        assert cache.get("a") is None