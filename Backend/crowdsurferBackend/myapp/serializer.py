from rest_framework import serializers

from .models import Report, keyLocation, scrapeData, userLocation


class ReportSerializer(serializers.ModelSerializer):
    class Meta:
        model = Report
        fields = ['id', 'location_Id', 'user_Id', 'crowd_Level', 'created_at']
        read_only_fields = ['id', 'created_at']

    def validate_crowd_Level(self, value):
        valid = [choice[0] for choice in Report.CROWD_LEVELS]
        if value not in valid:
            raise serializers.ValidationError(f"Must be one of: {valid}")
        return value


class ScrapeDataSerializer(serializers.ModelSerializer):
    class Meta:
        model = scrapeData
        fields = ['id', 'location_Id', 'occupancy', 'scraped_at']
        read_only_fields = ['id', 'scraped_at']

    def validate_occupancy(self, value):
        if not 0 <= value <= 100:
            raise serializers.ValidationError("Occupancy must be between 0 and 100")
        return value


class KeyLocationSerializer(serializers.ModelSerializer):
    class Meta:
        model = keyLocation
        fields = [
            'id', 'location_Id', 'name',
            'latitude', 'longitude',
            'radius_meters', 'capacity',
            'occupancy', 'updated_at',
        ]
        read_only_fields = ['id', 'updated_at']


class UserLocationSerializer(serializers.ModelSerializer):
    class Meta:
        model = userLocation  # was incorrectly referencing keyLocation
        fields = ['id', 'user_Id', 'latitude', 'longitude', 'updated_at']
        read_only_fields = ['id', 'updated_at']

    def validate_latitude(self, value):
        if not -90 <= value <= 90:
            raise serializers.ValidationError("Latitude must be between -90 and 90")
        return value

    def validate_longitude(self, value):
        if not -180 <= value <= 180:
            raise serializers.ValidationError("Longitude must be between -180 and 180")
        return value


class HeatmapPointSerializer(serializers.Serializer):
    """Lightweight serializer for heatmap GPS points."""
    latitude = serializers.FloatField()
    longitude = serializers.FloatField()
    weight = serializers.FloatField(default=1.0)
