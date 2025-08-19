import os
import django
import sys

# Add project root to sys.path so imports work
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'crowdsurferBackend.settings')
django.setup()

from myapp.models import scrapeData
from myapp.densityScraper import scrape_php_occupancy

def save_scraper_data():
    scraped_results = scrape_php_occupancy()
    
    # Check if scraping returned results
    if not scraped_results:
        print("No data was scraped. Check your scraper function.")
        return
    
    print(f"Processing {len(scraped_results)} results...")
    
    for result in scraped_results:
        try:
            scrapeData.objects.create(
                location_Id=result['location_Id'],
                occupancy=result['occupancy'],
            )
            print(f"Saved: {result['location_Id']} - {result['occupancy']}%")
        except Exception as e:
            print(f"Error saving {result}: {e}")
            continue
            
    print("Data processing completed.")

if __name__ == "__main__":
    save_scraper_data()