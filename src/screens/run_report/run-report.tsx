import { doc, getDoc } from 'firebase/firestore';
import React, { Fragment, useEffect, useState } from 'react';
import MapView, { Marker, Polyline } from 'react-native-maps';
import { socket } from 'server/server-utils';

import { auth, db } from '@/database/firebase-config';
import { fetchGameLeaderboard } from '@/database/games';
import type { Coord, IntervalRun } from '@/database/runs';
import { Image, ScrollView, Text, View } from '@/ui';

export interface RunReportProps {
  gameId: string;
  runId: string;
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
  if (coords.length === 0) {
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

/* eslint-disable max-lines-per-function */
export const RunReport = ({ gameId, runId }: RunReportProps) => {
  const [run, setRun] = useState<IntervalRun | null>(null);
  const [_isLoading, setIsLoading] = useState(true);
  const [_error, setError] = useState<any>(null);
  const [gameEnded, setGameEnded] = useState(false);

  const [leaderboardData, setLeaderboardData] = useState<any[]>([]);

  socket.on('game_ended', async (_data: any) => {
    setGameEnded(true);
  });

  useEffect(() => {
    const fetchLeaderboardData = async () => {
      const leaderboardData = await fetchGameLeaderboard(gameId);
      if (!leaderboardData) {
        // Game still in progress
        console.log('No leaderboard data yet!');
        return;
      }
      // Update leaderboard avgPace
      for (let entry of leaderboardData) {
        entry.avgPace = formatAvgPace(entry.time, entry.distance);
        // Convert distance from m to km
        entry.distance = entry.distance / 1000;
      }
      console.log('leaderboard:', leaderboardData);
      setLeaderboardData(leaderboardData);
    };

    fetchLeaderboardData();
  }, [gameEnded]);

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
          const runData = {
            id: runSnapshot.id,
            gameId: runSnapshot.data().gameId,
            ...runSnapshot.data(),
          } as IntervalRun;
          console.log(runData);
          setRun(runData);
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

  return (
    <ScrollView className="flex h-full">
      <View className="mb-60 flex-1">
        {run ? (
          <View className="flex gap-y-4 p-4">
            <View className="flex pt-4">
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
                  run.intervals[run.intervals.length - 1].route.length > 0 && (
                    <Marker
                      coordinate={
                        run.intervals[run.intervals.length - 1].route[
                          run.intervals[run.intervals.length - 1].route.length -
                            1
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
                          coordinate={interval.route[interval.route.length - 1]}
                          key={index}
                        >
                          <View
                            className="rounded-lg bg-white px-2"
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
                {leaderboardData.length > 0 ? (
                  leaderboardData.map((entry, index) => (
                    <View
                      key={index}
                      className="flex flex-row items-center border-b border-gray-200 py-2"
                    >
                      <Text className="mr-4 text-lg font-semibold">
                        {entry.rank}
                      </Text>
                      <Image
                        source={{ uri: entry.profilePic }}
                        className="mr-4 h-8 w-8 rounded-full"
                      />
                      <View style={{ flex: 2 }}>
                        <Text
                          className="text-md font-semibold"
                          numberOfLines={1}
                        >
                          {entry.name}
                        </Text>
                      </View>
                      <View className="ml-4 w-20">
                        <Text className="text-md font-bold">
                          {entry.distance.toFixed(2)} km
                        </Text>
                        <Text className="text-sm text-neutral-600">
                          {entry.avgPace}
                        </Text>
                      </View>
                    </View>
                  ))
                ) : (
                  <Text className="text-sm text-neutral-600">
                    Game still in progress, no leaderboard data yet!
                  </Text>
                )}
              </View>
            </View>

            <View className="pt-4">
              <Text className="text-lg font-bold">Your Intervals</Text>
              <View className="pt-2">
                {/* Table Header */}
                <View className="flex flex-row items-center gap-x-1 border-b border-gray-200 py-2">
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
                    className="flex flex-row items-center gap-x-1 border-b border-gray-200 py-4"
                  >
                    <Text className="text-md flex-1 font-semibold">
                      {index + 1}
                    </Text>
                    <Text className="text-md w-20  font-semibold">
                      {formatMeters(interval.distanceMeters)} m
                    </Text>
                    <Text className="text-md w-20 font-semibold">
                      {formatTimeElapsed(interval.durationMs)}
                    </Text>
                    <Text className="text-md w-24 font-semibold">
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
  );
};
