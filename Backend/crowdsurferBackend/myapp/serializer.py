# Converts complex data into native python data
from rest_framework import serializers
from .models import Report, scrapeData

class ReportSerializer(serializers.ModelSerializer):
    class Meta:
        model = Report
        fields = '__all__'  # This includes all fields from the model
    
    def validate_crowd_Level(self, value):
        """
        Custom validation for crowd level
        """
        valid_levels = ['quiet', 'not_busy', 'busy', 'very_busy', 'full']
        if value not in valid_levels:
            raise serializers.ValidationError(f"Invalid crowd level. Must be one of: {valid_levels}")
        return value

class ScrapeDataSerializer(serializers.ModelSerializer):
    class Meta:
        model = scrapeData
        fields = ['id', 'location_Id', 'occupancy', 'data']
    
    def validate_occupancy(self, value):
        """
        Custom validation for occupancy percentage
        """
        if value < 0 or value > 100:
            raise serializers.ValidationError("Occupancy must be between 0 and 100")
        return value

# Additional serializers for specific use cases
class ReportCreateSerializer(serializers.ModelSerializer):
    """
    Serializer specifically for creating reports
    """
    class Meta:
        model = Report
        fields = ['location_Id', 'crowd_Level']
    
    def create(self, validated_data):
        return Report.objects.create(**validated_data)

class OccupancySummarySerializer(serializers.Serializer):
    """
    Custom serializer for occupancy summary data
    """
    location_Id = serializers.CharField(max_length=10)
    occupancy = serializers.IntegerField()
    crowd_Level = serializers.CharField(max_length=20)
    last_updated = serializers.DateTimeField()
    report_count = serializers.IntegerField()