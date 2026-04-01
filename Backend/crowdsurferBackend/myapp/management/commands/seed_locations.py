"""
Management command: seed_locations
===================================
Populates the keyLocation table with the 4 McMaster campus study spaces.
Safe to re-run — uses update_or_create so existing rows are updated, not
duplicated.

Usage:
    python manage.py seed_locations
"""

from django.core.management.base import BaseCommand

from myapp.models import keyLocation

# Canonical locations.  Coordinates from Google Maps / campus maps.
LOCATIONS = [
    {
        'location_Id': 'mills_library',
        'name': 'Mills Library',
        'latitude': 43.2628,
        'longitude': -79.9192,
        'capacity': 800,
        'radius_meters': 120,
    },
    {
        'location_Id': 'thode_library',
        'name': 'Thode Library',
        'latitude': 43.26280,
        'longitude': -79.91920,
        'capacity': 400,
        'radius_meters': 100,
    },
    {
        'location_Id': 'health_sci_library',
        'name': 'Health Sciences Library',
        'latitude': 43.26023,
        'longitude': -79.91790,
        'capacity': 300,
        'radius_meters': 80,
    },
    {
        'location_Id': 'student_union',
        'name': 'Student Union Study Hall',
        'latitude': 43.26355,
        'longitude': -79.91774,
        'capacity': 200,
        'radius_meters': 60,
    },
]


class Command(BaseCommand):
    help = 'Seeds the keyLocation table with McMaster campus study spaces.'

    def handle(self, *args, **kwargs):
        for data in LOCATIONS:
            obj, created = keyLocation.objects.update_or_create(
                location_Id=data['location_Id'],
                defaults={k: v for k, v in data.items() if k != 'location_Id'},
            )
            label = 'Created' if created else 'Updated'
            self.stdout.write(f'  {label}: {obj.name}')

        self.stdout.write(self.style.SUCCESS('Done — key locations seeded.'))
