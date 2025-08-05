from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import generics  # Import the status module
from .models import Report
from .serializer import ReportSerializer

# Report View

    # This method handles get requests
class ReportView(generics.ListCreateAPIView):
    """
    This single class handles both GET (list) and POST (create) requests.
    """
    queryset = Report.objects.all()
    serializer_class = ReportSerializer