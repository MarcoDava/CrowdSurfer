
const USER_INFORMATION_PATH = FileSystem.documentDirectory +'UserInformation.json';
import * as FileSystem from 'expo-file-system';


export default async function prependUserLocation(newLocation : any) {
  console.log('Prepending user location:', newLocation);
  console.log('User Information Path:', USER_INFORMATION_PATH);
  let locations = [];
  try {
    const fileContent = await FileSystem.readAsStringAsync(USER_INFORMATION_PATH);
    console.log('reading location');
    locations = JSON.parse(fileContent);
  } catch (e) {
    // File might not exist yet, so start with empty array
    locations = [];
  }
  console.log('the file content:', locations);
  // Prepend new location
  locations.unshift(newLocation);
  // Write back to file
  await FileSystem.writeAsStringAsync(USER_INFORMATION_PATH, JSON.stringify(locations, null, 2));
}
