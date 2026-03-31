"""
Migration: multi-user refactor
- scrapeData  : add scraped_at, widen location_Id
- Report      : add user_Id + created_at, widen location_Id
- keyLocation : change occupancy CharField→IntegerField, widen/unique location_Id,
                add name / latitude / longitude / radius_meters / capacity / updated_at
- userLocation: widen + unique user_Id, add updated_at
"""
import django.utils.timezone
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('myapp', '0006_keylocation_userlocation_remove_scrapedata_data'),
    ]

    operations = [

        # ── scrapeData ────────────────────────────────────────────────────────
        migrations.AlterField(
            model_name='scrapedata',
            name='location_Id',
            field=models.CharField(max_length=50),
        ),
        migrations.AddField(
            model_name='scrapedata',
            name='scraped_at',
            field=models.DateTimeField(auto_now_add=True, default=django.utils.timezone.now),
            preserve_default=False,
        ),

        # ── Report ────────────────────────────────────────────────────────────
        migrations.AlterField(
            model_name='report',
            name='location_Id',
            field=models.CharField(max_length=50),
        ),
        migrations.AddField(
            model_name='report',
            name='user_Id',
            field=models.CharField(default='anonymous', max_length=100),
        ),
        migrations.AddField(
            model_name='report',
            name='created_at',
            field=models.DateTimeField(auto_now_add=True, default=django.utils.timezone.now),
            preserve_default=False,
        ),

        # ── keyLocation ───────────────────────────────────────────────────────
        migrations.AlterField(
            model_name='keylocation',
            name='location_Id',
            field=models.CharField(max_length=50, unique=True),
        ),
        # occupancy: CharField → IntegerField (existing string rows become 0)
        migrations.AlterField(
            model_name='keylocation',
            name='occupancy',
            field=models.IntegerField(default=0),
        ),
        migrations.AddField(
            model_name='keylocation',
            name='name',
            field=models.CharField(default='', max_length=100),
        ),
        migrations.AddField(
            model_name='keylocation',
            name='latitude',
            field=models.FloatField(default=0.0),
        ),
        migrations.AddField(
            model_name='keylocation',
            name='longitude',
            field=models.FloatField(default=0.0),
        ),
        migrations.AddField(
            model_name='keylocation',
            name='radius_meters',
            field=models.IntegerField(default=100),
        ),
        migrations.AddField(
            model_name='keylocation',
            name='capacity',
            field=models.IntegerField(default=500),
        ),
        migrations.AddField(
            model_name='keylocation',
            name='updated_at',
            field=models.DateTimeField(auto_now=True, default=django.utils.timezone.now),
            preserve_default=False,
        ),

        # ── userLocation ──────────────────────────────────────────────────────
        migrations.AlterField(
            model_name='userlocation',
            name='user_Id',
            field=models.CharField(max_length=100, unique=True),
        ),
        migrations.AddField(
            model_name='userlocation',
            name='updated_at',
            field=models.DateTimeField(auto_now=True, default=django.utils.timezone.now),
            preserve_default=False,
        ),
    ]
