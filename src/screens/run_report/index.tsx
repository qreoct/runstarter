import React, { Fragment, useEffect, useState } from 'react';
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
import MapView, { Callout, Marker, Polyline } from 'react-native-maps';
import { dismiss } from 'expo-auth-session';
import { Coord, IntervalRun } from '../run';

export interface RunReportProps {
  runId: string;
  onFinish: () => void;
}

function formatTotalDistance(run: IntervalRun) {
  let meters = 0;
  for (let interval of run.intervals) {
    meters += interval.distanceMeters;
  }
  return (meters / 1000).toFixed(2);
}

function formatRunAvgPace(run: IntervalRun) {
  let timeMs = 0;
  let distanceMeters = 0;
  for (let interval of run.intervals) {
    timeMs += interval.durationMs;
    distanceMeters += interval.distanceMeters;
  }
  return formatAvgPace(timeMs, distanceMeters);
}

function formatRunTime(run: IntervalRun) {
  let timeMs = 0;
  for (let interval of run.intervals) {
    timeMs += interval.durationMs;
  }
  return formatTimeElapsed(timeMs);
}

function formatTimeElapsed(milliseconds: number) {
  const minutes = Math.floor(milliseconds / 1000 / 60)
    .toString()
    .padStart(2, '0');
  const seconds = ((milliseconds / 1000) % 60).toString().padStart(2, '0');
  return `${minutes}:${seconds}`;
}

function formatAvgPace(timeMs: number, distanceMeters: number) {
  if (timeMs <= 0 || distanceMeters <= 0) {
    return '0\'00"';
  }
  const avgPace = timeMs / 1000 / 60 / (distanceMeters / 1000);
  const minutes = Math.floor(avgPace);
  const seconds = Math.round((avgPace - minutes) * 60);
  return `${minutes}'${seconds.toString().padStart(2, '0')}"`;
}

function formatMeters(meters: number) {
  return meters
    .toFixed(1)
    .toString()
    .replace(/(\d)(?=(\d\d\d)+(?!\d))/g, '$1,'); // commas every third digit
}

function calculateRunRegion(run: IntervalRun) {
  let coords: Coord[] = [];
  for (let interval of run.intervals) {
    for (let coord of interval.route) {
      coords.push(coord);
    }
  }
  if (coords.length == 0) {
    return null;
  }
  return _calculateRegion(coords);
}

function _calculateRegion(coords: Coord[]) {
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
  const latDelta = maxLat - minLat + 0.001; // Added a little padding
  const lonDelta = maxLon - minLon + 0.001; // Added a little padding

  return {
    latitude: midLat,
    longitude: midLon,
    latitudeDelta: latDelta,
    longitudeDelta: lonDelta,
  };
}

export const RunReport = ({ runId, onFinish }: RunReportProps) => {
  const [run, setRun] = useState<IntervalRun | null>(null);
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
          const run = runSnapshot.data() as IntervalRun;
          console.log(run);
          setRun(run);
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

  // const getKmMarkers = (records: PositionRecord[]): Coords[] => {
  //   let lastKm = 1;
  //   let distance = 0;
  //   const markers: Coords[] = [];
  //   for (let record of records) {
  //     distance += record.distance;
  //     if (distance / 1000 > lastKm) {
  //       markers.push(record.coords);
  //       lastKm++;
  //     }
  //   }
  //   console.log(markers);
  //   return markers;
  // };

  // function formatAvgPace(run: IntervalRun) {
  //   if (run.timeElapsed === 0 || run.distance === 0) {
  //     return '0\'00"';
  //   }
  //   const avgPace = run.timeElapsed / 60 / (run.distance / 1000);
  //   const minutes = Math.floor(avgPace);
  //   const seconds = Math.round((avgPace - minutes) * 60);
  //   return `${minutes}'${seconds.toString().padStart(2, '0')}"`;
  // }

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
          {run ? (
            <View className="p-4 flex gap-y-4">
              <View className="pt-4 flex">
                <Text className="text-6xl font-extrabold italic">
                  {formatTotalDistance(run)}
                </Text>
                <Text className="text-md text-neutral-600">Kilometres</Text>
              </View>
              <View className="flex flex-row gap-x-8">
                <View className="w-22">
                  <Text className="text-2xl font-semibold">
                    {formatRunAvgPace(run)}
                  </Text>
                  <Text className="text-sm text-neutral-600">Avg. Pace</Text>
                </View>
                <View className="w-22">
                  <Text className="text-2xl font-semibold">
                    {formatRunTime(run)}
                  </Text>
                  <Text className="text-sm text-neutral-600">Time</Text>
                </View>
              </View>

              <View className="flex max-h-72">
                <MapView
                  region={calculateRunRegion(run) ?? undefined}
                  scrollEnabled={false}
                  zoomEnabled={false}
                  style={{ width: '100%', height: '100%', borderRadius: 4 }}
                >
                  {/* Start Marker (Green) */}
                  {run.intervals.length > 0 &&
                    run.intervals[0].route.length > 0 && (
                      <Marker
                        coordinate={run.intervals[0].route[0]}
                        pinColor="green"
                      />
                    )}

                  {/* End Marker (Red) */}
                  {run.intervals.length > 0 &&
                    run.intervals[run.intervals.length - 1].route.length >
                      0 && (
                      <Marker
                        coordinate={
                          run.intervals[run.intervals.length - 1].route[
                            run.intervals[run.intervals.length - 1].route
                              .length - 1
                          ]
                        }
                        pinColor="red"
                      />
                    )}

                  {/* path and lap no. markers */}
                  {run.intervals.map((interval, index) => {
                    if (interval.route.length === 0) {
                      return;
                    }
                    return (
                      <Fragment key={index}>
                        <Polyline
                          coordinates={interval.route}
                          strokeColor="#3b82f6"
                          strokeWidth={6}
                        />
                        {index < run.intervals.length - 1 ? ( // don't draw lap no. for the last lap
                          <Marker
                            coordinate={
                              interval.route[interval.route.length - 1]
                            }
                            key={index}
                          >
                            <View
                              className="bg-white rounded-lg px-2"
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
                              }`}</Text>
                            </View>
                          </Marker>
                        ) : null}
                      </Fragment>
                    );
                  })}
                </MapView>
              </View>

              <View className="pt-4">
                <Text className="text-lg font-bold">Leaderboard</Text>
                <View>
                  {leaderboardData.map((entry, index) => (
                    <View
                      key={index}
                      className="flex flex-row items-center py-2 border-b border-gray-200"
                    >
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
                  {/* Data */}
                  {run.intervals.map((interval, index) => (
                    <View
                      key={index}
                      className="flex flex-row items-center gap-x-1 py-4 border-b border-gray-200"
                    >
                      <Text className="flex-1 text-md font-semibold">
                        {index + 1}
                      </Text>
                      <Text className="w-20 text-md  font-semibold">
                        {formatMeters(interval.distanceMeters)} m
                      </Text>
                      <Text className="w-20 text-md font-semibold">
                        {formatTimeElapsed(interval.durationMs)}
                      </Text>
                      <Text className="w-24 text-md font-semibold">
                        {formatAvgPace(
                          interval.durationMs,
                          interval.distanceMeters
                        )}
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
