# Converts complex data into native python data
from rest_framework import serializers
from .models import Report, scrapeData, keyLocation, userLocation

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
        fields = ['id', 'location_Id', 'occupancy']
    
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

class KeyLocationSerializer(serializers.ModelSerializer):
    class Meta:
        model = keyLocation
        fields = ['location_id', 'occupancy']
    
    # def validate_library_id(self, value):
    #     """
    #     Custom validation for library ID
    #     """
    #     if value not in keyLocationsData:
    #         raise serializers.ValidationError("Invalid library ID")
    def validate_occupancy(self, value):
        """
        Custom validation for occupancy percentage
        """
        if value < 0 or value > 100:
            raise serializers.ValidationError("Occupancy must be between 0 and 100")
        return value
    
class UserLocationSerializer(serializers.ModelSerializer):
    class Meta:
        model = keyLocation
        fields = ['user_id', 'latitude', 'longitude']
    
    def validate_latitude(self, value):
        
        if value < -90 or value > 90:
            raise serializers.ValidationError("Latitude must be between -90 and 90")
        return value
    
    def validate_longitude(self, value):
        
        if value < -180 or value > 180:
            raise serializers.ValidationError("Longitude must be between -180 and 180")
        return value