import React, { useEffect, useState } from 'react';
import {
  doc,
  addDoc,
  collection,
  serverTimestamp,
  getDoc,
} from 'firebase/firestore';
import { auth, db } from '@/database/firebase-config';
import { SafeAreaView, ScrollView, Text, View } from '@/ui';
import { ModalHeader } from '@/ui/core/modal/modal-header';
import WalkedPathMap from '../run/walked-path-map';
import MapView, { Callout, Marker, Polyline } from 'react-native-maps';
import { Coords, PositionRecord, Run } from '../run';
import { dismiss } from 'expo-auth-session';

export interface RunReportProps {
  runId: string;
  onFinish: () => void;
}

export const RunReport = ({ runId, onFinish }: RunReportProps) => {
  const [runData, setRunData] = useState<Run | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<any>(null);

  useEffect(() => {
    const fetchRunData = async () => {
      try {
        const uid = auth.currentUser?.uid;
        if (!uid) {
          throw new Error('No user logged in.');
        }
        const runDocRef = doc(db, 'users', uid, 'runs', runId);
        const runSnapshot = await getDoc(runDocRef);
        if (runSnapshot.exists()) {
          console.log('fuck', runSnapshot.data().route);
          setRunData(runSnapshot.data() as Run);
          // onFinish();
        } else {
          throw new Error('Run not found.');
        }
      } catch (err) {
        console.log('error:', err);
        setError(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRunData();
  }, [runId]);

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

  const getKmMarkers = (records: PositionRecord[]): Coords[] => {
    let lastKm = 1;
    let distance = 0;
    const markers: Coords[] = [];
    for (let record of records) {
      distance += record.distance;
      if (distance / 1000 > lastKm) {
        markers.push(record.coords);
        lastKm++;
      }
    }
    console.log(markers);
    return markers;
  };

  return (
    <SafeAreaView>
      <ModalHeader
        title=""
        dismiss={() => {
          onFinish();
        }}
      />
      <ScrollView className="h-full">
        {runData ? (
          <View className="p-4 flex gap-y-4">
            <View className="pt-4 flex">
              <Text className="text-6xl font-extrabold italic">
                {(runData.distance / 1000).toFixed(2)}
              </Text>
              <Text className="text-md text-neutral-600">Kilometres</Text>
            </View>
            <View className="flex flex-row gap-x-8">
              <View className="w-22">
                <Text className="text-2xl font-semibold">
                  {(
                    runData.timeElapsed /
                    60 /
                    (runData.distance / 1000)
                  ).toFixed(2)}
                </Text>
                <Text className="text-sm text-neutral-600">Avg. Pace</Text>
              </View>
              <View className="w-22">
                <Text className="text-2xl font-bold">
                  {Math.floor(runData.timeElapsed / 60)
                    .toString()
                    .padStart(2, '0')}
                  :{(runData.timeElapsed % 60).toString().padStart(2, '0')}
                </Text>
                <Text className="text-sm text-neutral-600">Time</Text>
              </View>
            </View>

            <View className="flex">
              <MapView
                region={
                  runData.route.length > 0
                    ? calculateRegion(runData.route.map((r) => r.coords))!
                    : undefined
                }
                scrollEnabled={false}
                zoomEnabled={false}
                style={{ width: '100%', height: '100%', borderRadius: 8 }}
              >
                <Polyline
                  coordinates={runData.route.map((r) => r.coords)}
                  strokeColor="#000" // Black color
                  strokeWidth={3}
                />
                {/* Start Marker (Green) */}
                {runData.route.length > 0 && (
                  <Marker
                    coordinate={runData.route[0].coords}
                    pinColor="green"
                  />
                )}

                {/* End Marker (Red) */}
                {runData.route.length > 0 && (
                  <Marker
                    coordinate={runData.route[runData.route.length - 1].coords}
                    pinColor="red"
                  />
                )}

                {getKmMarkers(runData.route).map((coords, index) => (
                  <Marker coordinate={coords} key={index}>
                    <View
                      className="bg-white rounded-md px-1"
                      style={{
                        shadowColor: '#000',
                        shadowOffset: { width: 0, height: 1 },
                        shadowOpacity: 0.3,
                        shadowRadius: 2,
                        elevation: 5, // for android
                      }}
                    >
                      <Text className="text-xs font-medium">{`${
                        index + 1
                      } km`}</Text>
                    </View>
                  </Marker>
                ))}
              </MapView>
            </View>

            <View className="pt-4">
              <Text className="text-lg font-bold">Leaderboard</Text>
            </View>
          </View>
        ) : null}
      </ScrollView>
    </SafeAreaView>
  );
};
