# urls.py
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

# Create a router for DRF ViewSets
router = DefaultRouter()
router.register(r'scrapedata', views.ScrapeDataViewSet, basename='scrapedata')
router.register(r'key-locations', views.KeyLocationViewSet, basename='key-locations')
router.register(r'user-locations', views.UserLocationViewSet, basename='user-locations')

# Define URL patterns
urlpatterns = [
    # Include DRF router URLs under /api/
    path('api/', include(router.urls)),
    
    # Custom API endpoints for occupancy data
    path('api/occupancy/', views.get_latest_occupancy, name='latest_occupancy'),
    path('api/occupancy/<str:location_id>/', views.get_location_occupancy, name='location_occupancy'),
    
    # Report endpoints
    path('api/reports/', views.ReportView.as_view(), name='report_list_create'),
    path('api/reports/<int:pk>/', views.ReportDetailView.as_view(), name='report_detail'),
    path('api/reports/location/<str:location_id>/', views.get_reports_by_location, name='reports_by_location'),
    path('api/reports/create/', views.create_report, name='create_report'),
    
    # Alternative report endpoint (using custom APIView)
    path('api/reports-custom/', views.ReportAPIView.as_view(), name='report_custom'),
    
    # Location endpoints
    path('api/update-key-location/', views.UpdateKeyLocationsView.as_view(), name='update-key-location'),
    path('api/save-user-location/', views.SaveUserLocationView.as_view(), name='save-user-location'),
]