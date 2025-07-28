# CrowdSurfer

How the app will work:
It will ping the users location every 1-2 minutes and adds it into a database of user locations. It will then use all the locations in the database to determine how full an area is.
Additions:
If they are not within a key location such as mac, we will not add their location to the database
If they close the app, a notification will stay active and continue pinging their location. The notification will contain a stop button if they wish not to share their location.
We will use bluetooth of a user to determine the number of nearby phones in the area. This reduces the need for numerous users and provide an accurate number of people within a 10 meter radius. 

Features:
Display a heatmap of crowded areas:
We would take the users location and then add to the database. Once all locations are received, it will display a heatmap of areas that are full and not full. Red would mean crowded, transparent would mean empty, yellow or orange are in between at medium crowd levels. 

Turn location services on or off:
We need to ensure that the user feels comfortable using the app and can turn off location services. However, they cannot use the features listed unless they turn on their location services. This makes sure that we respect user privacy but also collect the data when they are comfortable using the app.

Can show occupancy level (empty, light crowd, heavy crowd, full, etc).
If user clicks on a location, it will show the occupancy level with a slider. So the user can accurately understand the occupancy level. 

Show a locations occupancy schedule at certain times:
If user clicks on location, they will be given a timeline of when the location is full. The data would be filled from the previous submissions in the database. We would take the average of the hour to represent how busy it was. 

For example:
1pm, full - 2pm, low occupancy- etc. This would be shown in a graph.

Show occupancy level during different times of the month or different seasons. Like a line chart. Could start seeing different patterns through different seasons

Submit survey: 
User has an option to submit survey and submit how occupied the area is. This information would be useful because we would know how accurate our app is and we can use their surveys to add into the heatmap. 


Features to be approved:
Can show where your friends are if you add them on the app
Can make yourself invisible or visible with a status (Will still add their location to a heatmap, but friends cannot see where you are).
Shows route to get from class to class

User Flow Map:
Users clicks on the app.
User location is shared
User Location added to occupancy level (post to backend)
The user sees the map

UML:
https://drive.google.com/file/d/1WSpvuNVmVtbVMwPENbiMv79-TqVcS8Zl/view?usp=sharing 

Figma Design:
https://www.figma.com/design/WLSLSm4HqoCaGzrmXHF5n2/Untitled?node-id=0-1&m=dev&t=TOl985Zr5KJvb6Ae-1 

Repo:
https://github.com/MarcoDava/CrowdSurfer 

Costs: 
Deployment on Android: $25
Deployment on Apple: $25


MVP: Shows occupancy level of an area through simple text (very busy, busy, not that busy, quiet)

Final: Surveys, Login, Heatmap, Graph





Tech Stack:
Frontend:
React Native
Javascript/Typescript
Backend:
Python
Database:
MongoDB
Framework:
Django


