from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By
import time

# Replace this with your Brave executable path:
BRAVE_PATH = r"C:\Program Files\BraveSoftware\Brave-Browser\Application\brave.exe"

chrome_options = Options()
chrome_options.binary_location = BRAVE_PATH
chrome_options.add_argument("--headless")  # Remove if you want to see the browser window
chrome_options.add_argument("--disable-gpu")
chrome_options.add_argument("--no-sandbox")

driver = webdriver.Chrome(options=chrome_options)

try:
    driver.get("https://library.mcmaster.ca/occupancy-live-status-libraries")
    time.sleep(5)  # wait for page and JS to load

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
            section_occ_tag = section_header.find_element(By.XPATH, "following-sibling::p[contains(text(), 'Occupancy at')]")
            section_occupancy = section_occ_tag.text.replace("Occupancy at ", "")
            sections.append({"section": section_name, "occupancy": section_occupancy})

        data.append({
            "library": library_name,
            "overall_occupancy": overall_occupancy,
            "sections": sections
        })

    for lib in data:
        print(f"{lib['library']} - {lib['overall_occupancy']}")
        for sec in lib["sections"]:
            print(f"  {sec['section']}: {sec['occupancy']}")
        print()

finally:
    driver.quit()
