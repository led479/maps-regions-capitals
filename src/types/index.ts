
import { LatLng } from 'react-native-maps';

export interface MapMarker {
  latlng: LatLng
  title: string
  description: string
}

export interface Capital {
  CountryName: string
  CapitalName: string
  CapitalLatitude: string
  CapitalLongitude: string
  CountryCode: string
  ContinentName: string
}
