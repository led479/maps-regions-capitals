import React, { useState, useRef } from "react";
import MapView, { MapPressEvent, Marker } from "react-native-maps";
import { StyleSheet, View } from "react-native";
import countryToRegionJson from "./assets/country-to-region.json";
import countryCapitalsJson from "./assets/country-capitals.json";
import { createMarkers, findCountry } from "./src/helpers";
import { MapMarker } from "./src/types";

export default function App() {
  const [markers, setMarkers] = useState<MapMarker[]>([]);

  const mapRef = useRef(null);

  const markCapitals = async (e: MapPressEvent) => {
    const countryCode = await findCountry(e.nativeEvent.coordinate);
    const region = countryToRegionJson[countryCode];

    if (!region) {
      console.error(`Couldn't find region of country ${countryCode}`);
    }

    const capitals = countryCapitalsJson.filter(
      (c) => c.ContinentName === region
    );
    const newMarkers = createMarkers(capitals);
    setMarkers(newMarkers);

    const coordinates = newMarkers.map((marker) => marker.latlng);
    mapRef.current.fitToCoordinates(coordinates);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}></View>
      <MapView ref={mapRef} onPress={markCapitals} style={styles.map}>
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
    height: "10%",
  },
  map: {
    width: "100%",
    height: "90%",
  },
});
