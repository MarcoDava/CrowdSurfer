from django.urls import include, path
from rest_framework.routers import DefaultRouter

from . import views

router = DefaultRouter()
router.register(r'scrapedata', views.ScrapeDataViewSet, basename='scrapedata')
router.register(r'key-locations', views.KeyLocationViewSet, basename='key-locations')
router.register(r'user-locations', views.UserLocationViewSet, basename='user-locations')

urlpatterns = [
    # ViewSet CRUD routes
    path('api/', include(router.urls)),

    # Occupancy (algorithm-driven)
    path('api/occupancy/', views.get_latest_occupancy, name='latest_occupancy'),
    path('api/occupancy/<str:location_id>/', views.get_location_occupancy, name='location_occupancy'),

    # Heatmap — active user GPS points for the frontend map
    path('api/heatmap/', views.get_heatmap_points, name='heatmap'),

    # Reports
    path('api/reports/', views.ReportView.as_view(), name='report_list_create'),
    path('api/reports/<int:pk>/', views.ReportDetailView.as_view(), name='report_detail'),
    path('api/reports/location/<str:location_id>/', views.get_reports_by_location, name='reports_by_location'),

    # User & location management
    path('api/save-user-location/', views.SaveUserLocationView.as_view(), name='save-user-location'),
    path('api/update-key-location/', views.UpdateKeyLocationsView.as_view(), name='update-key-location'),
]
