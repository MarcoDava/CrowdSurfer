from selenium import webdriver
from selenium.webdriver.chrome.options import Options as ChromeOptions
from selenium.webdriver.edge.options import Options as EdgeOptions
from selenium.webdriver.firefox.options import Options as FirefoxOptions
from selenium.webdriver.common.by import By
import time

# This function is just to test different browsers
def get_driver():
    """Try to get Chrome, then Edge, then Firefox WebDriver."""
    # Try Chrome
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

    # Try Edge
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

    # Try Firefox
    try:
        options = FirefoxOptions()
        options.add_argument("--headless")
        driver = webdriver.Firefox(options=options)
        print("Using Firefox WebDriver")
        return driver
    except Exception:
        pass

    raise RuntimeError("No supported WebDriver found. Please install ChromeDriver, EdgeDriver, or GeckoDriver.")

# This is the actual scraper
def scrape_php_occupancy():
    driver = get_driver()
    try:
        url = "https://library.mcmaster.ca/php/occupancy-spaces.php"
        driver.get(url)
        time.sleep(2)  

        cards = driver.find_elements(By.CSS_SELECTOR, ".card.card-shadow")

        data = []
        for card in cards:
            library_name = card.find_element(By.TAG_NAME, "h3").text

            occupancy_tag = card.find_element(By.XPATH, ".//p[contains(text(), 'Occupancy at')]")
            overall_occupancy = occupancy_tag.text.replace("Occupancy at ", "")

            sections = []
            section_headers = card.find_elements(By.TAG_NAME, "h4")
            for section_header in section_headers:
                section_name = section_header.text
                section_occ_tag = section_header.find_element(By.XPATH, "following-sibling::div/following-sibling::p[contains(text(), 'Occupancy at')]")
                section_occupancy = section_occ_tag.text.replace("Occupancy at ", "")
                sections.append({"section": section_name, "occupancy": section_occupancy})

            data.append({
                "library": library_name,
                "overall_occupancy": overall_occupancy,
                "sections": sections
            })

        # print nicely
        for lib in data:
            print(f"{lib['library']} - {lib['overall_occupancy']}")
            for sec in lib["sections"]:
                print(f"  {sec['section']}: {sec['occupancy']}")
            print()

    finally:
        driver.quit()

if __name__ == "__main__":
    scrape_php_occupancy()
