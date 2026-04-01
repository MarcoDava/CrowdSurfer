from datetime import timedelta

from django.utils import timezone
from rest_framework import generics, status, viewsets
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import Report, keyLocation, scrapeData, userLocation
from .ReportAlgorithm import compute_occupancy
from .serializer import (
    HeatmapPointSerializer,
    KeyLocationSerializer,
    ReportSerializer,
    ScrapeDataSerializer,
    UserLocationSerializer,
)

HEATMAP_WINDOW_MINUTES = 10


# ── ViewSets (full CRUD for admin / scraper use) ──────────────────────────────

class ScrapeDataViewSet(viewsets.ModelViewSet):
    queryset = scrapeData.objects.all()
    serializer_class = ScrapeDataSerializer


class KeyLocationViewSet(viewsets.ModelViewSet):
    queryset = keyLocation.objects.all()
    serializer_class = KeyLocationSerializer


class UserLocationViewSet(viewsets.ModelViewSet):
    queryset = userLocation.objects.all()
    serializer_class = UserLocationSerializer


# ── Report endpoints ──────────────────────────────────────────────────────────

class ReportView(generics.ListCreateAPIView):
    """GET all reports / POST a new report."""
    queryset = Report.objects.all()
    serializer_class = ReportSerializer


class ReportDetailView(generics.RetrieveUpdateDestroyAPIView):
    """GET / PUT / DELETE a single report by pk."""
    queryset = Report.objects.all()
    serializer_class = ReportSerializer


@api_view(['GET'])
def get_reports_by_location(request, location_id):
    """Return all reports for a specific location."""
    reports = Report.objects.filter(location_Id=location_id)
    return Response(ReportSerializer(reports, many=True).data)


# ── Occupancy endpoints ───────────────────────────────────────────────────────

@api_view(['GET'])
def get_latest_occupancy(request):
    """
    Compute and return occupancy for every key location.

    Response shape (list):
      [{location_Id, name, occupancy, latitude, longitude, updated_at, timestamp}]

    The algorithm blends scraper data (40%), recent crowd reports (30%), and
    active-user proximity (30%).  Results are persisted back to keyLocation.
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
            # millisecond timestamp so the frontend can display "X min ago"
            'timestamp': int(loc.updated_at.timestamp() * 1000),
        })
    return Response(results)


@api_view(['GET'])
def get_location_occupancy(request, location_id):
    """Compute and return occupancy for a single location."""
    try:
        loc = keyLocation.objects.get(location_Id=location_id)
    except keyLocation.DoesNotExist:
        return Response({'error': 'Location not found'}, status=status.HTTP_404_NOT_FOUND)

    loc.occupancy = compute_occupancy(loc)
    loc.save(update_fields=['occupancy', 'updated_at'])
    return Response(KeyLocationSerializer(loc).data)


# ── Heatmap endpoint ──────────────────────────────────────────────────────────

@api_view(['GET'])
def get_heatmap_points(request):
    """
    Return GPS positions of all users active in the last HEATMAP_WINDOW_MINUTES.

    Response shape (list):
      [{latitude, longitude, weight}]

    Each user contributes weight=1.0.  The frontend heatmap clusters
    overlapping points into a heat gradient automatically.
    """
    cutoff = timezone.now() - timedelta(minutes=HEATMAP_WINDOW_MINUTES)
    active = userLocation.objects.filter(updated_at__gte=cutoff)
    points = [
        {'latitude': u.latitude, 'longitude': u.longitude, 'weight': 1.0}
        for u in active
    ]
    return Response(points)


# ── User location ─────────────────────────────────────────────────────────────

class SaveUserLocationView(APIView):
    """
    Upsert a user's current GPS position.

    POST body: {user_Id, latitude, longitude}

    One row is kept per user_Id and updated in place on every call so the
    table never grows unboundedly.  The updated_at timestamp is refreshed
    automatically (auto_now=True on the model), which is what the heatmap
    and proximity algorithm use to filter active users.
    """

    def post(self, request):
        serializer = UserLocationSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(
                {'status': 'error', 'errors': serializer.errors},
                status=status.HTTP_400_BAD_REQUEST,
            )

        data = serializer.validated_data
        obj, created = userLocation.objects.update_or_create(
            user_Id=data['user_Id'],
            defaults={
                'latitude': data['latitude'],
                'longitude': data['longitude'],
            },
        )
        return Response(
            {
                'status': 'success',
                'created': created,
                'data': UserLocationSerializer(obj).data,
            },
            status=status.HTTP_201_CREATED if created else status.HTTP_200_OK,
        )


# ── Key location management ───────────────────────────────────────────────────

class UpdateKeyLocationsView(APIView):
    """Upsert a key location by location_Id."""

    def post(self, request):
        location_id = request.data.get('location_Id')
        if not location_id:
            return Response(
                {'status': 'error', 'message': 'location_Id is required'},
                status=status.HTTP_400_BAD_REQUEST,
            )

        try:
            instance = keyLocation.objects.get(location_Id=location_id)
            serializer = KeyLocationSerializer(instance, data=request.data, partial=True)
        except keyLocation.DoesNotExist:
            serializer = KeyLocationSerializer(data=request.data)

        if serializer.is_valid():
            serializer.save()
            return Response({'status': 'success', 'data': serializer.data})

        return Response(
            {'status': 'error', 'errors': serializer.errors},
            status=status.HTTP_400_BAD_REQUEST,
        )
