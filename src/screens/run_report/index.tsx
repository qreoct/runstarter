import React, { useEffect, useState } from 'react';
import {
  doc,
  addDoc,
  collection,
  serverTimestamp,
  getDoc,
} from 'firebase/firestore';
import { auth, db } from '@/database/firebase-config';
import { Image, SafeAreaView, ScrollView, Text, View } from '@/ui';
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

  const leaderboardData = [
    {
      rank: 1,
      profilePic:
        'https://ph-avatars.imgix.net/18280/d1c43757-f761-4a37-b933-c4d84b461aea?auto=compress&codec=mozjpeg&cs=strip&auto=format&w=120&h=120&fit=crop&dpr=2',
      name: 'Dexter Leng',
      distance: 3.01,
      avgPace: '2\'83"',
    },
    {
      rank: 2,
      profilePic:
        'https://ph-avatars.imgix.net/18280/d1c43757-f761-4a37-b933-c4d84b461aea?auto=compress&codec=mozjpeg&cs=strip&auto=format&w=120&h=120&fit=crop&dpr=2',
      name: 'Aria Stark',
      distance: 2.78,
      avgPace: '3\'12"',
    },
    {
      rank: 3,
      profilePic:
        'https://ph-avatars.imgix.net/18280/d1c43757-f761-4a37-b933-c4d84b461aea?auto=compress&codec=mozjpeg&cs=strip&auto=format&w=120&h=120&fit=crop&dpr=2',
      name: 'John Snow',
      distance: 2.5,
      avgPace: '3\'40"',
    },
    {
      rank: 4,
      profilePic:
        'https://ph-avatars.imgix.net/18280/d1c43757-f761-4a37-b933-c4d84b461aea?auto=compress&codec=mozjpeg&cs=strip&auto=format&w=120&h=120&fit=crop&dpr=2',
      name: 'Bartholomew Alexander Maximillian Montgomery Fitzgerald III',
      distance: 2.1,
      avgPace: '4\'05"',
    },
  ];

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

  function formatAvgPace(run: Run) {
    if (run.timeElapsed === 0 || run.distance === 0) {
      return '0\'00"';
    }
    const avgPace = run.timeElapsed / 60 / (run.distance / 1000);
    const minutes = Math.floor(avgPace);
    const seconds = Math.round((avgPace - minutes) * 60);
    return `${minutes}'${seconds.toString().padStart(2, '0')}"`;
  }

  return (
    <SafeAreaView>
      <ModalHeader
        title=""
        dismiss={() => {
          onFinish();
        }}
      />
      <ScrollView className="flex h-full">
        <View className="flex-1 mb-60">
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
                    {formatAvgPace(runData)}
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

              <View className="flex max-h-72">
                <MapView
                  region={
                    runData.route.length > 0
                      ? calculateRegion(runData.route.map((r) => r.coords))!
                      : undefined
                  }
                  scrollEnabled={false}
                  zoomEnabled={false}
                  style={{ width: '100%', height: '100%', borderRadius: 4 }}
                >
                  <Polyline
                    coordinates={runData.route.map((r) => r.coords)}
                    strokeColor="#3b82f6" // Black color
                    strokeWidth={8}
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
                      coordinate={
                        runData.route[runData.route.length - 1].coords
                      }
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
                <View>
                  {leaderboardData.map((entry) => (
                    <View className="flex flex-row items-center py-2 border-b border-gray-200">
                      <Text className="text-lg font-semibold mr-4">
                        {entry.rank}
                      </Text>
                      <Image
                        source={{ uri: entry.profilePic }}
                        className="w-8 h-8 rounded-full mr-4"
                      />
                      <View style={{ flex: 2 }}>
                        <Text
                          className="text-md font-semibold"
                          numberOfLines={1}
                        >
                          {entry.name}
                        </Text>
                      </View>
                      <View className="w-20 ml-4">
                        <Text className="text-md font-bold">
                          {entry.distance.toFixed(2)} km
                        </Text>
                        <Text className="text-sm text-neutral-600">
                          {entry.avgPace}
                        </Text>
                      </View>
                    </View>
                  ))}
                </View>
              </View>

              <View className="pt-4">
                <Text className="text-lg font-bold">Your Intervals</Text>
                <View className="pt-2">
                  {/* Table Header */}
                  <View className="flex flex-row items-center gap-x-1 py-2 border-b border-gray-200">
                    <Text className="flex-1 text-sm text-neutral-600">Lap</Text>
                    <Text className="w-20 text-sm text-neutral-600">
                      Distance
                    </Text>
                    <Text className="w-20 text-sm text-neutral-600">Time</Text>
                    <Text className="w-24 text-sm text-neutral-600">
                      Avg. Pace
                    </Text>
                  </View>
                  {/* Mock Data */}
                  {[
                    // Just an example, you'd populate with real data
                    {
                      lap: 1,
                      distance: 712,
                      time: '05:00',
                      avgPace: '7\'01"',
                    },
                    {
                      lap: 2,
                      distance: 700,
                      time: '04:50',
                      avgPace: '6\'52"',
                    },
                    {
                      lap: 3,
                      distance: 715,
                      time: '05:05',
                      avgPace: '7\'05"',
                    },
                  ].map((interval, index) => (
                    <View
                      key={index}
                      className="flex flex-row items-center gap-x-1 py-4 border-b border-gray-200"
                    >
                      <Text className="flex-1 text-sm font-semibold">
                        {interval.lap}
                      </Text>
                      <Text className="w-20 text-sm  font-semibold">
                        {interval.distance} m
                      </Text>
                      <Text className="w-20 text-sm font-semibold">
                        {interval.time}
                      </Text>
                      <Text className="w-24 text-sm font-semibold">
                        {interval.avgPace}
                      </Text>
                    </View>
                  ))}
                </View>
              </View>
            </View>
          ) : null}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};
