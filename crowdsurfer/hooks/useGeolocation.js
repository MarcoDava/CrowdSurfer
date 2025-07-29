import { useState } from "react";

export const useGeolocation = () => {
  const [locationInfo, setLocationInfo] = useState(null);
  const [locationError, setLocationError] = useState(null);

  const { geolocation } = navigator;

  const successFn = (res) => {
    console.log({ res });
    setLocationInfo(res.coords);
  };

  const errorFn = (res) => {
    console.log({ res });
    setLocationError(res.message);
  };

  if (!locationError && !locationInfo) {
    geolocation.getCurrentPosition(successFn, errorFn);
  }

  return { locationError, locationInfo };
};