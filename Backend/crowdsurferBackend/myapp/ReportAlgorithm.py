"""
ReportAlgorithm
===============
Computes a 0-100 occupancy estimate for each key location by blending three
independent data sources with configurable weights:

  Source            Default weight  Description
  ────────────────  ──────────────  ─────────────────────────────────────────
  Scraper           40 %            Latest scraped value from McMaster website
  Crowd reports     30 %            Average of user-submitted levels (last 30 min)
  User proximity    30 %            Fraction of capacity within GPS radius (last 10 min)

If a source has no current data its weight is redistributed proportionally
among the sources that do have data.  When no source has data the cached
`keyLocation.occupancy` value is returned unchanged.
"""

import math
from datetime import timedelta

from django.utils import timezone

from .models import Report, keyLocation, scrapeData, userLocation

# ── Weights (must sum to 1.0) ─────────────────────────────────────────────────
W_SCRAPE = 0.40
W_REPORT = 0.30
W_PROXIMITY = 0.30

# ── Time windows ─────────────────────────────────────────────────────────────
REPORT_WINDOW_MINUTES = 30   # how old a crowd report can be and still count
USER_WINDOW_MINUTES = 10     # how old a GPS ping can be and still count

# ── Crowd-level → occupancy mapping ──────────────────────────────────────────
CROWD_LEVEL_PCT: dict[str, int] = {
    'quiet':    12,
    'not_busy': 35,
    'busy':     65,
    'very_busy': 85,
    'full':     98,
}


def haversine_meters(lat1: float, lon1: float, lat2: float, lon2: float) -> float:
    """Great-circle distance in metres between two (lat, lon) points."""
    R = 6_371_000  # Earth radius in metres
    phi1, phi2 = math.radians(lat1), math.radians(lat2)
    dphi = math.radians(lat2 - lat1)
    dlam = math.radians(lon2 - lon1)
    a = (math.sin(dphi / 2) ** 2
         + math.cos(phi1) * math.cos(phi2) * math.sin(dlam / 2) ** 2)
    return 2 * R * math.asin(math.sqrt(a))


def _scrape_occupancy(location_id: str) -> int | None:
    """Latest scraped occupancy for a location, or None if unavailable."""
    record = (
        scrapeData.objects
        .filter(location_Id=location_id)
        .order_by('-scraped_at', '-id')
        .first()
    )
    return record.occupancy if record else None


def _report_occupancy(location_id: str) -> float | None:
    """
    Average occupancy implied by recent crowd reports, or None if no reports
    exist within REPORT_WINDOW_MINUTES.
    """
    cutoff = timezone.now() - timedelta(minutes=REPORT_WINDOW_MINUTES)
    recent = Report.objects.filter(
        location_Id=location_id,
        created_at__gte=cutoff,
    )
    if not recent.exists():
        return None
    values = [CROWD_LEVEL_PCT.get(r.crowd_Level, 50) for r in recent]
    return sum(values) / len(values)


def _proximity_occupancy(location: keyLocation) -> float | None:
    """
    Fraction of capacity represented by users currently near the location,
    expressed as 0-100.  Returns None if no users have checked in recently.
    """
    cutoff = timezone.now() - timedelta(minutes=USER_WINDOW_MINUTES)
    active_users = list(userLocation.objects.filter(updated_at__gte=cutoff))
    if not active_users:
        return None
    nearby = sum(
        1 for u in active_users
        if haversine_meters(
            u.latitude, u.longitude,
            location.latitude, location.longitude,
        ) <= location.radius_meters
    )
    return min(100.0, nearby / max(location.capacity, 1) * 100)


def compute_occupancy(location: keyLocation) -> int:
    """
    Return an estimated occupancy (0-100) for *location*.

    Sources with no current data are dropped and their weight is redistributed
    proportionally among the remaining sources.  If all sources are empty the
    cached `location.occupancy` value is returned.
    """
    candidates: dict[str, tuple[float, float]] = {}  # name → (value, weight)

    scrape = _scrape_occupancy(location.location_Id)
    if scrape is not None:
        candidates['scrape'] = (float(scrape), W_SCRAPE)

    report = _report_occupancy(location.location_Id)
    if report is not None:
        candidates['report'] = (report, W_REPORT)

    proximity = _proximity_occupancy(location)
    if proximity is not None:
        candidates['proximity'] = (proximity, W_PROXIMITY)

    if not candidates:
        return location.occupancy  # nothing fresh — keep the cached value

    total_weight = sum(w for _, w in candidates.values())
    weighted_sum = sum(v * w for v, w in candidates.values())
    return max(0, min(100, round(weighted_sum / total_weight)))


def refresh_all_occupancies() -> list[dict]:
    """
    Recompute and persist occupancy for every key location.
    Returns a list of summary dicts suitable for API responses.
    """
    results = []
    for loc in keyLocation.objects.all():
        loc.occupancy = compute_occupancy(loc)
        loc.save(update_fields=['occupancy', 'updated_at'])
        results.append({
            'location_Id': loc.location_Id,
            'name': loc.name,
            'occupancy': loc.occupancy,
            'latitude': loc.latitude,
            'longitude': loc.longitude,
            'updated_at': loc.updated_at.isoformat(),
            'timestamp': int(loc.updated_at.timestamp() * 1000),
        })
    return results
