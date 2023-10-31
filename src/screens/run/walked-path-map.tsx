import React from 'react';
import MapView, { Polyline } from 'react-native-maps';

import type { Coords } from './index';

const WalkedPathMap = ({ coords: inputCoords }: { coords: Coords[] }) => {
  // Assuming the path is an array of coordinates in the format:
  // [{ latitude: xxx, longitude: yyy }, ...]

  // Optionally, calculate the region to display based on the path
  // let region = {
  //   latitude: coords[0].latitude,
  //   longitude: coords[0].longitude,
  //   latitudeDelta: 0.005, // Adjust as needed
  //   longitudeDelta: 0.005, // Adjust as needed
  // };

  const calculateRegion = (coords: Coords[]) => {
    console.log(coords.length);
    // Define initial min and max lat and lon values
    if (coords.length === 0) {
      return null;
    }
    let minLat = coords[0].latitude;
    let maxLat = coords[0].latitude;
    let minLon = coords[0].longitude;
    let maxLon = coords[0].longitude;

    // Iterate through path to find min and max lat and lon values
    for (let point of coords) {
      minLat = Math.min(minLat, point.latitude);
      maxLat = Math.max(maxLat, point.latitude);
      minLon = Math.min(minLon, point.longitude);
      maxLon = Math.max(maxLon, point.longitude);
    }

    const midLat = (minLat + maxLat) / 2;
    const midLon = (minLon + maxLon) / 2;
    const latDelta = maxLat - minLat + 0.005; // Added a little padding
    const lonDelta = maxLon - minLon + 0.005; // Added a little padding

    return {
      latitude: midLat,
      longitude: midLon,
      latitudeDelta: latDelta,
      longitudeDelta: lonDelta,
    };
  };

  return (
    <MapView region={calculateRegion(inputCoords) ?? undefined}>
      <Polyline
        coordinates={inputCoords}
        strokeColor="#000" // Black color
        strokeWidth={3}
      />
    </MapView>
  );
};

export default WalkedPathMap;
