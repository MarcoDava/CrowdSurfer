import logo from "./logo.svg";
import "./App.css";
import { useState, useEffect } from "react";
import * as Location from 'expo-location';


function App() {
  // const { locationInfo, locationError } = useGeolocation();
  const isOnline = useIsOnline();
  
  const[location, setLocation] = useState();

  useEffect(() => {
    const getPermissions = async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if ( status !== 'granted' )  {
        console.log("Please give permission to access location")
        return;
      }

      let currentLocation = await Location.getCurrentPositionAsync({});
      setLocation(currentLocation);
      console.log("Location");
      console.log(currentLocation);
    };
    getPermissions();
  }, []);

  console.log({ isOnline });

  if (!isOnline) {
    return <p>You are not connected!!</p>;
  }

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;