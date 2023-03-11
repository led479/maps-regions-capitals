import React, { useState, useRef } from 'react';
import MapView, { MapPressEvent, LatLng, Marker } from 'react-native-maps';
import { StyleSheet, View } from 'react-native';
import countryToRegionJson from './assets/country-to-region.json'
import countryCapitalsJson from './assets/country-capitals.json'

interface Marker {
  latlng: LatLng,
  title: string,
  description: string
}


export default function App() {
  const [markers, setMarkers] = useState([])

  const mapRef = useRef(null)

  const logCoordinates = (e: MapPressEvent) => {
    console.log(`Lat: ${e.nativeEvent.coordinate.latitude}, Lng: ${e.nativeEvent.coordinate.longitude}`)

    const countryCode = "UA"
    const region = countryToRegionJson[countryCode]

    if (!region) {
      console.error(`Couldn't find region of country ${countryCode}`)
    }

    console.log('country: ', countryCode)
    console.log('region: ', region)

    const capitals = countryCapitalsJson.filter(c => c.ContinentName === region)
    const newMarkers: Marker[] = capitals.map(c => ({
      latlng: { latitude: parseFloat(c.CapitalLatitude), longitude: parseFloat(c.CapitalLongitude) },
      title: c.CapitalName,
      description: `Capital of ${c.CountryName}`
    }))

    setMarkers(newMarkers)

    mapRef.current.fitToElements()

    console.log('capitals: ', capitals)
    console.log('newMarkers: ', newMarkers)
  }
  

  return (
    <View style={styles.container}>
      <View style={styles.header}>

      </View>
      <MapView 
        ref={mapRef}
        onPress={logCoordinates} 
        style={styles.map} 
      >
        {markers.map((marker, index) => (
          <Marker
            key={index}
            coordinate={marker.latlng}
            title={marker.title}
            description={marker.description}
          />
        ))}
      </MapView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    height: '10%'
  },
  map: {
    width: '100%',
    height: '90%',
  },
});