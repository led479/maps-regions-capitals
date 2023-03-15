import React, { useState, useRef, useEffect, useCallback } from "react";
import MapView, { MapPressEvent, Marker } from "react-native-maps";
import { StyleSheet, View, Text } from "react-native";
import { Picker } from '@react-native-picker/picker';
import Icon from 'react-native-vector-icons/SimpleLineIcons';
import countryToRegionJson from "./assets/country-to-region.json";
import countryCapitalsJson from "./assets/country-capitals.json";
import { createMarkers, findCountry } from "./src/helpers";
import { MapMarker } from "./src/types";

export default function App() {
  const [markers, setMarkers] = useState<MapMarker[]>([]);
  const [selectedRegion, setSelectedRegion] = useState<'Asia' | 'Europe' | undefined>();

  const mapRef = useRef<MapView | null>(null);

  const handlePress = async (e: MapPressEvent) => {
    const countryCode = await findCountry(e.nativeEvent.coordinate);
    const region = countryToRegionJson[countryCode];

    if (!region) {
      console.error(`Implemented for Europe and Asia only. Couldn't find region of country ${countryCode}.`);
      return;
    }

    if (region !== 'Asia' && region !== 'Europe') {
      console.error(`Implemented for Europe and Asia only.`);
      return;
    }

    setSelectedRegion(region)
  };  

  const markCapitals = useCallback(
    () => {
      const capitals = countryCapitalsJson.filter(
        (c) => c.ContinentName === selectedRegion
      );
      const newMarkers = createMarkers(capitals);
      setMarkers(newMarkers);
  
      const coordinates = newMarkers.map((marker) => marker.latlng);
      mapRef.current.fitToCoordinates(coordinates)
    },
    [selectedRegion],
  )
  

  useEffect(() => {
    markCapitals()
  }, [selectedRegion])



  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Filter by region:</Text>
        <View style={styles.pickerContainer}>
          <Icon style={styles.pickerBoxIcon} name="globe" color="grey" />
          <Picker
            selectedValue={selectedRegion}
            onValueChange={itemValue =>
              setSelectedRegion(itemValue)
            }
            style={styles.picker}
          >
            <Picker.Item label="Select a region" value={undefined} />
            <Picker.Item label="Europe" value="Europe" />
            <Picker.Item label="Asia" value="Asia" />
          </Picker>
        </View>
        
      </View>
      <View style={styles.mapContainer}>
        <MapView ref={mapRef} onPress={handlePress} style={StyleSheet.absoluteFillObject}>
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
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 30,
  },
  header: {
    paddingHorizontal: 10,
    paddingBottom: 5,
    alignItems: 'center',
    justifyContent: 'space-between',
    flexDirection: 'row',
  },
  headerText: {
    color: 'grey',
  },
  pickerContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    borderColor: 'lightgrey',
    borderWidth: 0.5,
    borderRadius: 5,
    height: 50,
    width: 170
  },
  pickerBoxIcon: {
    fontSize: 23,
    paddingLeft: 20
  },
  picker: {
    width: '80%',
    color: 'dimgrey'
  },
  mapContainer: {
    flex: 1,
  },
  map: {
    height: '100%',
    width: '100%'
  }
});
