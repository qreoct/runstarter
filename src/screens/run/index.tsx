import React, { useState, useEffect, useRef } from 'react';
import { Button, Text, View } from 'react-native';
import Geolocation from '@react-native-community/geolocation';

import { FocusAwareStatusBar, ScrollView } from '@/ui';

interface Coords {
  latitude: number;
  longitude: number;
}

interface PositionRecord {
  coords: Coords;
  distance: number;
}

export const Run: React.FC = () => {
  const [distance, setDistance] = useState<number>(0);
  const [timeElapsed, setTimeElapsed] = useState<number>(0);
  const previousPositionRef = useRef<Coords | null>(null);
  const [positionRecords, setPositionRecords] = useState<PositionRecord[]>([]);
  const [isRunning, setIsRunning] = useState<boolean>(true);

  const calculateDistance = (
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number
  ): number => {
    const R = 6371e3;
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  useEffect(() => {
    if (isRunning) {
      const timer = setInterval(() => {
        setTimeElapsed((prevTime) => prevTime + 1);
      }, 1000);

      const watchId = Geolocation.watchPosition(
        (position) => {
          if (!previousPositionRef.current) {
            previousPositionRef.current = {
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
            };
          } else {
            const dist = calculateDistance(
              previousPositionRef.current.latitude,
              previousPositionRef.current.longitude,
              position.coords.latitude,
              position.coords.longitude
            );
            setDistance((prevDistance) => prevDistance + dist);
            previousPositionRef.current = {
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
            };
            setPositionRecords((prevRecords) => {
              const newRecord = {
                coords: {
                  latitude: position.coords.latitude,
                  longitude: position.coords.longitude,
                },
                distance: dist,
              };
              return [newRecord, ...prevRecords].slice(0, 20);
            });

            console.log('position', position, 'distance', dist);
          }
        },
        (error) => console.warn(error),
        { enableHighAccuracy: true, distanceFilter: 10 }
      );
      return () => {
        Geolocation.clearWatch(watchId);
        clearInterval(timer);
      };
    }
  }, [isRunning]);

  return (
    <>
      <FocusAwareStatusBar />
      <ScrollView className="pt-16">
        <Text>Distance traveled: {distance.toFixed(2)} meters</Text>
        <Text>Time elapsed: {timeElapsed} seconds</Text>
        <Button
          title={isRunning ? 'Pause' : 'Play'}
          onPress={() => setIsRunning(!isRunning)}
        />

        {/* <View>
          {positionRecords.map((record, index) => (
            <View key={index}>
              <Text>
                Latitude: {record.coords.latitude}, Longitude:{' '}
                {record.coords.longitude}
              </Text>
              <Text>Distance: {record.distance.toFixed(2)} meters</Text>
            </View>
          ))}
        </View> */}
      </ScrollView>
    </>
  );
};
