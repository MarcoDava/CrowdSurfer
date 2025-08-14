from selenium import webdriver
from selenium.webdriver.chrome.options import Options as ChromeOptions
from selenium.webdriver.edge.options import Options as EdgeOptions
from selenium.webdriver.firefox.options import Options as FirefoxOptions
from selenium.webdriver.common.by import By
import time

def get_driver():
    try:
        options = ChromeOptions()
        options.add_argument("--headless")
        options.add_argument("--disable-gpu")
        options.add_argument("--no-sandbox")
        driver = webdriver.Chrome(options=options)
        print("Using Chrome WebDriver")
        return driver
    except Exception:
        pass

    try:
        options = EdgeOptions()
        options.add_argument("--headless")
        options.add_argument("--disable-gpu")
        options.add_argument("--no-sandbox")
        driver = webdriver.Edge(options=options)
        print("Using Edge WebDriver")
        return driver
    except Exception:
        pass

    try:
        options = FirefoxOptions()
        options.add_argument("--headless")
        driver = webdriver.Firefox(options=options)
        print("Using Firefox WebDriver")
        return driver
    except Exception:
        pass

    raise RuntimeError("No supported WebDriver found.")

def scrape_php_occupancy():
    driver = get_driver()
    results = []
    try:
        url = "https://library.mcmaster.ca/php/occupancy-spaces.php"
        driver.get(url)
        time.sleep(2)

        cards = driver.find_elements(By.CSS_SELECTOR, ".card.card-shadow")
        print(f"Found {len(cards)} cards")
        
        for card in cards:
            try:
                library_name = card.find_element(By.TAG_NAME, "h3").text
                occupancy_tag = card.find_element(By.XPATH, ".//p[contains(text(), 'Occupancy at')]")
                occupancy_str = occupancy_tag.text.replace("Occupancy at ", "")
                occupancy = int(occupancy_str.replace('%', ''))  # clean percentage

                result = {
                    "location_Id": library_name[:10],  # max length 10
                    "occupancy": occupancy
                }
                results.append(result)
                print(f"Scraped: {library_name} - {occupancy}%")
                
            except Exception as e:
                print(f"Error processing card: {e}")
                continue
                
    except Exception as e:
        print(f"Error during scraping: {e}")
    finally:
        driver.quit()

    print(f"Returning {len(results)} results")
    return results  # This was missing!

if __name__ == "__main__":
    # Just print results for testing
    results = scrape_php_occupancy()
    for r in results:
        print(r)