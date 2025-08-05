# Converts complex data into native python data

# serializers.py
from rest_framework import serializers
from .models import *

class ReportSerializer(serializers.ModelSerializer):
    class Meta:
        model = Report
        fields = '__all__'
