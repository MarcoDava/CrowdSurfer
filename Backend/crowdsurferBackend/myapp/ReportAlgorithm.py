# How will this work?
# Different weights to different sources depending on reports, density.io sensors, a bunch of other stuff
# Density.io will have the highest 

# Getting the ball rolling, the weighting system will be  out of 100, Density.io will have a rating of 40, crowd reports: 20, our own user database: 20, bluetooth and user database: 20


# The code below will be for the webscraper, in the future it will be moved to a different file for OOP

from bs4 import BeautifulSoup
import requests
import re
import json

page_to_scrape = requests.get("https://library.mcmaster.ca/occupancy-live-status-libraries")
soup = BeautifulSoup(page_to_scrape.content, 'html.parser')

location_names = soup.findAll("h3",attrs = {"class":"mb-1"})#find all location names, Mill's, Thode, etc
location_occupancies = soup.findAll("p",attrs = {"class":"mb-2"})#find the occupancy percentages

for location_name,location_occupancy in zip(location_names,location_occupancies):
    print(location_name.text+" has an occupancy of level of: "+location_occupancy.text+"%")
                 