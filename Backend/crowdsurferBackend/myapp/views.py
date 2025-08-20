from django.shortcuts import render
from rest_framework import generics, viewsets, status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.decorators import api_view
from .models import Report, scrapeData, keyLocation, userLocation
from .serializer import ReportSerializer, ScrapeDataSerializer , KeyLocationSerializer, UserLocationSerializer

# Report Views
class ReportView(generics.ListCreateAPIView):
    """
    This single class handles both GET (list) and POST (create) requests.
    """
    queryset = Report.objects.all()
    serializer_class = ReportSerializer

class ReportDetailView(generics.RetrieveUpdateDestroyAPIView):
    """
    Handles GET, PUT, PATCH, DELETE for individual reports
    """
    queryset = Report.objects.all()
    serializer_class = ReportSerializer

# ScrapeData Views
class ScrapeDataViewSet(viewsets.ModelViewSet):
    """
    ViewSet for CRUD operations on scrapeData
    """
    queryset = scrapeData.objects.all()
    serializer_class = ScrapeDataSerializer

# KeyLocation Views
class KeyLocationViewSet(viewsets.ModelViewSet):
    queryset = keyLocation.objects.all()
    serializer_class = KeyLocationSerializer

# UserLocation Views
class UserLocationViewSet(viewsets.ModelViewSet):
    queryset = userLocation.objects.all()
    serializer_class = UserLocationSerializer

# Custom API Views for Frontend Integration
@api_view(['GET'])
def get_latest_occupancy(request):
    """
    Get the latest occupancy data for all locations
    """
    try:
        # Get the latest record for each location
        latest_data = []
        locations = scrapeData.objects.values_list('location_Id', flat=True).distinct()
        
        for location_id in locations:
            latest_record = scrapeData.objects.filter(
                location_Id=location_id
            ).order_by('-id').first()
            
            if latest_record:
                latest_data.append({
                    'location_Id': latest_record.location_Id,
                    'occupancy': latest_record.occupancy,
                    'data': latest_record.data,
                    'timestamp': latest_record.id  # Using id as rough timestamp
                })
        
        return Response(latest_data, status=status.HTTP_200_OK)
    
    except Exception as e:
        return Response(
            {'error': str(e)}, 
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )

@api_view(['GET'])
def get_location_occupancy(request, location_id):
    """
    Get occupancy data for a specific location
    """
    try:
        latest_record = scrapeData.objects.filter(
            location_Id=location_id
        ).order_by('-id').first()
        
        if not latest_record:
            return Response(
                {'error': 'Location not found'}, 
                status=status.HTTP_404_NOT_FOUND
            )
        
        serializer = ScrapeDataSerializer(latest_record)
        return Response(serializer.data, status=status.HTTP_200_OK)
    
    except Exception as e:
        return Response(
            {'error': str(e)}, 
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )

@api_view(['POST'])
def create_report(request):
    """
    Create a new crowd report
    """
    try:
        serializer = ReportSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    except Exception as e:
        return Response(
            {'error': str(e)}, 
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )

@api_view(['GET'])
def get_reports_by_location(request, location_id):
    """
    Get all reports for a specific location
    """
    try:
        reports = Report.objects.filter(location_Id=location_id)
        serializer = ReportSerializer(reports, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    
    except Exception as e:
        return Response(
            {'error': str(e)}, 
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )

# Alternative class-based view approach for reports
class ReportAPIView(APIView):
    """
    Custom API view for reports with more control
    """
    
    def get(self, request):
        """Get all reports"""
        reports = Report.objects.all()
        serializer = ReportSerializer(reports, many=True)
        return Response({
            'status': 'success',
            'data': serializer.data,
            'count': len(serializer.data)
        })
    
    def post(self, request):
        """Create a new report"""
        serializer = ReportSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({
                'status': 'success',
                'message': 'Report created successfully',
                'data': serializer.data
            }, status=status.HTTP_201_CREATED)
        
        return Response({
            'status': 'error',
            'message': 'Invalid data',
            'errors': serializer.errors
        }, status=status.HTTP_400_BAD_REQUEST)
    
class UpdateKeyLocationsView(APIView):
    def post(self, request):
        try:
            serializer = KeyLocationSerializer(data=request.data)
            if serializer.is_valid():
                serializer.save()
                return Response({
                    'status': 'success',
                    'message': 'Key location saved successfully',
                    'data': serializer.data
                }, status=status.HTTP_201_CREATED)
            
            return Response({
                'status': 'error',
                'message': 'Invalid data',
                'errors': serializer.errors
            }, status=status.HTTP_400_BAD_REQUEST)
            
        except Exception as e:
            return Response({
                'status': 'error',
                'message': str(e)
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class SaveUserLocationView(APIView):
    def post(self, request):
        try:
            serializer = UserLocationSerializer(data=request.data)
            if serializer.is_valid():
                serializer.save()
                return Response({
                    'status': 'success',
                    'message': 'User location saved successfully',
                    'data': serializer.data
                }, status=status.HTTP_201_CREATED)
            
            return Response({
                'status': 'error',
                'message': 'Invalid location data',
                'errors': serializer.errors
            }, status=status.HTTP_400_BAD_REQUEST)
            
        except Exception as e:
            return Response({
                'status': 'error',
                'message': str(e)
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
