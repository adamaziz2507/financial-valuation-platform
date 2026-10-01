"""Minimal in-memory cache with per-entry expiry."""

import time
from typing import Generic, TypeVar

T = TypeVar("T")


class TTLCache(Generic[T]):
    def __init__(self, ttl_seconds: float) -> None:
        self._ttl_seconds = ttl_seconds
        self._entries: dict[str, tuple[float, T]] = {}

    def get(self, key: str) -> T | None:
        entry = self._entries.get(key)
        if entry is None:
            return None

        stored_at, value = entry
        if time.monotonic() - stored_at >= self._ttl_seconds:
            del self._entries[key]
            return None

        return value

    def set(self, key: str, value: T) -> None:
        self._entries[key] = (time.monotonic(), value)