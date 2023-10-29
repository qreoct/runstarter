import React, { useState, useEffect, useRef } from 'react';
import { Button, SafeAreaView } from 'react-native';
import Geolocation from '@react-native-community/geolocation';
import { FocusAwareStatusBar, ScrollView, View, Text } from '@/ui';
import { auth, db } from 'firebase-config';
import {
  addDoc,
  collection,
  doc,
  serverTimestamp,
  setDoc,
} from 'firebase/firestore';
import WalkedPathMap from './WalkedPathMap';
import { Audio, InterruptionModeAndroid, InterruptionModeIOS } from 'expo-av';

export interface Coords {
  latitude: number;
  longitude: number;
}

interface PositionRecord {
  coords: Coords;
  distance: number;
}

export interface RunProps {
  onFinish: () => void;
}

const audioFiles: { [key: number]: any } = {
  0.5: require('../../../assets/distances/0.5.wav'),
  1.0: require('../../../assets/distances/1.0.wav'),
  1.5: require('../../../assets/distances/1.5.wav'),
  2.0: require('../../../assets/distances/2.0.wav'),
  2.5: require('../../../assets/distances/2.5.wav'),
  3.0: require('../../../assets/distances/3.0.wav'),
  3.5: require('../../../assets/distances/3.5.wav'),
  4.0: require('../../../assets/distances/4.0.wav'),
  4.5: require('../../../assets/distances/4.5.wav'),
  5.0: require('../../../assets/distances/5.0.wav'),
};

export const Run = (props: RunProps) => {
  const [distance, setDistance] = useState<number>(0);
  const [timeElapsed, setTimeElapsed] = useState<number>(0);
  const previousPositionRef = useRef<Coords | null>(null);
  const [positionRecords, setPositionRecords] = useState<PositionRecord[]>([]);
  const [isRunning, setIsRunning] = useState<boolean>(true);
  const playedDistancesRef = useRef(new Set<number>());

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

  const playSound = async (distance: number) => {
    if (distance in audioFiles) {
      let soundFile = audioFiles[distance];
      const soundObject = new Audio.Sound();
      try {
        await soundObject.loadAsync(soundFile, { shouldPlay: true });
        await soundObject.setPositionAsync(0);
        await soundObject.playAsync();
      } catch (error) {
        console.log('Error playing sound:', error);
      }
    }
  };

  useEffect(() => {
    if (isRunning) {
      const timer = setInterval(() => {
        setTimeElapsed((prevTime) => prevTime + 1);
      }, 1000);

      // const testtimer = setInterval(() => {
      //   playSound(0.5);
      // }, 3000);

      async function setAudioMode() {
        await Audio.setAudioModeAsync({
          allowsRecordingIOS: false,
          staysActiveInBackground: true,
          interruptionModeIOS: InterruptionModeIOS.DuckOthers,
          playsInSilentModeIOS: true,
          shouldDuckAndroid: true,
          interruptionModeAndroid: InterruptionModeAndroid.DuckOthers,
          playThroughEarpieceAndroid: false,
        });
      }

      setAudioMode();

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
            setDistance((prevDistance) => {
              const updatedDistance = prevDistance + dist;
              const updatedKm = updatedDistance / 1000; // Convert to kilometers
              const prevKm = prevDistance / 1000; // Convert to kilometers

              // Check in reverse from updatedKm to prevKm for the furthest milestone crossed
              for (
                let milestone = Math.floor(updatedKm * 2) / 2;
                milestone >= prevKm;
                milestone -= 0.5
              ) {
                if (!playedDistancesRef.current.has(milestone)) {
                  playSound(milestone);
                  playedDistancesRef.current.add(milestone);
                  break; // Exit once the latest milestone sound is played
                }
              }
              return updatedDistance;
            });
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
              return [...prevRecords, newRecord];
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
        // clearInterval(testtimer);
      };
    }
  }, [isRunning]);

  const handleFinish = async () => {
    try {
      // Stop tracking
      setIsRunning(false);

      // Get current user's UID
      const uid = auth.currentUser?.uid;
      if (!uid) {
        console.error('No user logged in.');
        return;
      }

      // Prepare data for Firestore
      const runData = {
        timeElapsed,
        distance,
        timestamp: serverTimestamp(),
      };

      // Reference to the current user's runs sub-collection
      const runsCollectionRef = collection(db, 'users', uid, 'runs');

      // Save to Firestore
      const docRef = await addDoc(runsCollectionRef, runData);

      console.log('Document saved with ID: ', docRef.id);
    } catch (error) {
      console.error('Error saving to Firestore: ', error);
    }

    props.onFinish();
  };

  const avgPace =
    timeElapsed && distance ? timeElapsed / 60 / (distance / 1000) : 0; // pace in min/km

  return (
    <>
      <FocusAwareStatusBar />
      <ScrollView className="pt-16 bg-black flex">
        <View className="flex flex-row justify-center gap-x-4">
          <View className="items-center">
            <Text className="text-white text-xl">
              {(distance / 1000).toFixed(2)}
            </Text>
            <Text className="text-white">kilometres</Text>
          </View>
          <View className="items-center">
            <Text className="text-white text-xl">
              {avgPace.toFixed(2)} min/km
            </Text>
            <Text className="text-white">Avg. Pace</Text>
          </View>
          <View className="items-center">
            <Text className="text-white text-xl">
              {Math.floor(timeElapsed / 60)
                .toString()
                .padStart(2, '0')}
              :{(timeElapsed % 60).toString().padStart(2, '0')}
            </Text>
            <Text className="text-white">Time</Text>
          </View>
        </View>

        {isRunning ? (
          <Button title="Pause" onPress={() => setIsRunning(false)} />
        ) : (
          <View className="flex flex-col">
            <Button title="Resume" onPress={() => setIsRunning(true)} />
            <Button title="Finish" onPress={() => handleFinish()} />
          </View>
        )}

        {/* {positionRecords.length > 0 ? (
          <WalkedPathMap coords={positionRecords.map((r) => r.coords)} />
        ) : null} */}

        {/* <WalkedPathMap
          coords={[{ latitude: 42.785834, longitude: -123.99143 }]}
        /> */}

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
