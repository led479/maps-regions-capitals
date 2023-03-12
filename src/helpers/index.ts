import { LatLng } from 'react-native-maps';
import { Capital, MapMarker } from '../types';
import Geocode from '../utils/geocode';


export const createMarkers = (capitals: Capital[]): MapMarker[] => {
  return capitals.map(c => ({
    latlng: { latitude: parseFloat(c.CapitalLatitude), longitude: parseFloat(c.CapitalLongitude) },
    title: c.CapitalName,
    description: `Capital of ${c.CountryName}`
  }));
}

export const findCountry = async (latLng: LatLng): Promise<string> => {
  try {
    const res = await Geocode.fromLatLng(latLng.latitude, latLng.longitude);

    if (res.status === "OK") {
      const country = res.results.find(r => r.types.includes("country") && r.types.includes("political"));

      if (!country) {
        throw new Error(`Country not found for latitude: ${latLng.latitude}, longitude: ${latLng.longitude}`);
      }

      return country.address_components[0].short_name;
    } else {
      throw new Error(`Request for maps api failed: ${res.status}`);
    }
  }
  catch (err) {
    console.error(err);
    return "";
  }
}