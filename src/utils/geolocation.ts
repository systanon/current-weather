interface GeolocationCoordinates {
  latitude: number;
  longitude: number;
  altitude?: number | null;
  accuracy: number;
  altitudeAccuracy?: number | null;
  heading?: number | null;
  speed?: number | null;
}

interface GeolocationPosition {
  coords: GeolocationCoordinates;
  timestamp: number;
}

interface GeolocationPositionError {
  code: number;
  message: string;
}

export const getGeolocation = async (
  fn: any,
  params: any
): Promise<void> => {
  if (!navigator?.geolocation) {
    console.error('Geolocation is not supported by this browser.');
    return;
  }

  return new Promise<any>((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(
      async ({coords}) => {
        const { latitude, longitude } = coords;

        const q = `${latitude},${longitude}`;
        params.q = q;
        const data =  await fn.getWeather(params);
        resolve(data);
      },
      (error: GeolocationPositionError) => {
        console.error(error.message);
        reject(error);
      }
    );
  });
};