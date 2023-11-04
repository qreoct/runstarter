import {
  Button,
  FocusAwareStatusBar,
  SafeAreaView,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
  Pause as PauseIcon,
  Image,
} from '@/ui';
import React, { useEffect, useRef, useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import Geolocation from '@react-native-community/geolocation';

export interface RunProps {
  onFinish: (id: string | null) => void;
}

export interface Interval {
  durationSeconds: number;
  distanceMeters: number;
  route: Coord[];
}

export interface Coord {
  latitude: number;
  longitude: number;
}

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

const profileImages = [
  'https://ph-avatars.imgix.net/18280/d1c43757-f761-4a37-b933-c4d84b461aea?auto=compress&codec=mozjpeg&cs=strip&auto=format&w=120&h=120&fit=crop&dpr=2',
  'https://ph-avatars.imgix.net/18280/d1c43757-f761-4a37-b933-c4d84b461aea?auto=compress&codec=mozjpeg&cs=strip&auto=format&w=120&h=120&fit=crop&dpr=2',
  'https://ph-avatars.imgix.net/18280/d1c43757-f761-4a37-b933-c4d84b461aea?auto=compress&codec=mozjpeg&cs=strip&auto=format&w=120&h=120&fit=crop&dpr=2',
  'https://ph-avatars.imgix.net/18280/d1c43757-f761-4a37-b933-c4d84b461aea?auto=compress&codec=mozjpeg&cs=strip&auto=format&w=120&h=120&fit=crop&dpr=2',
  'https://ph-avatars.imgix.net/18280/d1c43757-f761-4a37-b933-c4d84b461aea?auto=compress&codec=mozjpeg&cs=strip&auto=format&w=120&h=120&fit=crop&dpr=2',
];

function calculateRouteDistanceMeters(route: Coord[]): number {
  if (route.length === 0) {
    return 0;
  }
  let totalMeters = 0;
  let prevCoord = route[0];
  for (let coord of route) {
    totalMeters += calculateDistance(
      prevCoord.latitude,
      prevCoord.longitude,
      coord.latitude,
      coord.longitude
    );
    prevCoord = coord;
  }
  return totalMeters;
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

function formatTimeElapsed(milliseconds: number) {
  const minutes = Math.floor(milliseconds / 1000 / 60)
    .toString()
    .padStart(2, '0');
  const seconds = ((milliseconds / 1000) % 60).toString().padStart(2, '0');
  return `${minutes}:${seconds}`;
}

// TODO: end when TOTAL_INTERVALS is hit
// TODO: fix pace calculation when paused.
// TODO: save to firebase and show report.
/* eslint-disable max-lines-per-function */
export const Run = (props: RunProps) => {
  const REST_DURATION_MS = 5_000;
  const INTERVAL_DURATION_MS = 10_000;
  const TOTAL_INTERVALS = 8;

  const [isRunning, setIsRunning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [millisecondsLeft, setMillisecondsLeft] = useState(REST_DURATION_MS);
  const [route, setRoute] = useState<Coord[]>([]);
  const [previousIntervals, setPreviousIntervals] = useState<Interval[]>([]);
  const currentCoordsRef = useRef<Coord | null>(null);

  useEffect(() => {
    if (isRunning && !isPaused) {
      const watchId = Geolocation.watchPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          currentCoordsRef.current = { latitude, longitude };
        },
        (error) => console.warn(error),
        { enableHighAccuracy: true, distanceFilter: 10 }
      );
      return () => {
        Geolocation.clearWatch(watchId);
      };
    } else {
      currentCoordsRef.current = null;
    }
  }, [isRunning, isPaused]);

  function lastAvgPace() {
    console.log('LAST AVG PACE', isRunning);
    if (isRunning) {
      const distanceMeters = calculateRouteDistanceMeters(route);
      return formatAvgPace(
        INTERVAL_DURATION_MS - millisecondsLeft,
        distanceMeters
      );
    } else if (previousIntervals.length > 0) {
      const interval = previousIntervals[previousIntervals.length - 1];
      console.log('INTERVAL AT REST', interval);
      return formatAvgPace(INTERVAL_DURATION_MS, interval.distanceMeters);
    } else {
      return formatAvgPace(0, 0);
    }
  }

  useEffect(() => {
    if (isPaused) {
      return;
    }

    if (isRunning) {
      const pollMs = 1000;
      const timer = setTimeout(() => {
        const newMillisecondsLeft = millisecondsLeft - pollMs;
        if (newMillisecondsLeft >= 0) {
          // interval still happening
          setMillisecondsLeft(newMillisecondsLeft);
          setRoute((route) => {
            if (currentCoordsRef.current) {
              return [...route, currentCoordsRef.current];
            } else {
              return route;
            }
          });

          const distanceMeters = calculateRouteDistanceMeters(route);
          console.log('RUN', {
            currentInterval: previousIntervals.length + 1,
            newMillisecondsLeft,
            route,
            distance: distanceMeters,
            pace: formatAvgPace(
              INTERVAL_DURATION_MS - newMillisecondsLeft,
              distanceMeters
            ),
          });
        } else {
          // interval ended. transition to rest or end the run.
          const distanceMeters = calculateRouteDistanceMeters(route);
          const interval: Interval = {
            durationSeconds: INTERVAL_DURATION_MS,
            distanceMeters,
            route,
          };
          setPreviousIntervals((intervals) => [...intervals, interval]);
          setIsRunning(false);
          setRoute([]);
          currentCoordsRef.current = null;
          setMillisecondsLeft(REST_DURATION_MS);
        }
      }, pollMs);
      return () => {
        clearInterval(timer);
      };
    } else {
      // is resting
      const pollMs = 1000;
      const timer = setTimeout(() => {
        const newMillisecondsLeft = millisecondsLeft - pollMs;
        if (newMillisecondsLeft >= 0) {
          // rest still happening
          console.log('REST', { newMillisecondsLeft });
          setMillisecondsLeft(newMillisecondsLeft);
        } else {
          // rest ended. transition to interval.
          setIsRunning(true);
          setMillisecondsLeft(INTERVAL_DURATION_MS);
        }
      }, pollMs);
      return () => clearInterval(timer);
    }
  }, [isRunning, isPaused, millisecondsLeft]);

  return (
    <>
      <SafeAreaView className="h-full flex bg-black justify-between">
        <View className="py-4 flex flex-1 flex-cols justify-between">
          <View className="px-8 flex flex-row justify-between gap-x-4">
            <View className="items-center w-22">
              <Text className="text-2xl text-white font-bold">
                {lastAvgPace()}
              </Text>
              <Text className="text-white/50 font-semibold">Pace</Text>
            </View>
            <View className="items-center w-22">
              <Text className="text-2xl text-white font-bold">
                {previousIntervals.length + 1}
              </Text>
              <Text className="text-white/50 font-semibold">Interval</Text>
            </View>
            <View className="items-center w-22">
              <Text className="text-2xl text-white font-bold">
                {formatTimeElapsed(millisecondsLeft)}
              </Text>
              <Text className="text-white/50 font-semibold">Time</Text>
            </View>
          </View>

          <View className="flex items-center">
            <Text className="text-8xl text-white font-extrabold italic">
              {formatTimeElapsed(millisecondsLeft)}
            </Text>
            <Text className="text-xl text-white/50 font-semibold">
              {isRunning ? 'Time' : 'Rest'}
            </Text>
          </View>

          <View>
            <ScrollView
              horizontal={true}
              showsHorizontalScrollIndicator={false}
              className="px-6 flex gap-x-4"
            >
              {profileImages.map((image, index) => (
                <Image
                  key={index}
                  source={{ uri: image }}
                  className="w-20 h-20 rounded-full"
                />
              ))}
            </ScrollView>
          </View>
        </View>

        <View className="flex items-center py-8">
          {!isPaused ? (
            <TouchableOpacity
              className="bg-white w-20 h-20 rounded-full flex justify-center items-center"
              onPress={() => {
                setIsPaused(true);
              }}
            >
              <Ionicons name="ios-pause" size={32} color="black" />
            </TouchableOpacity>
          ) : (
            <View className="flex flex-row gap-20">
              <TouchableOpacity
                className="bg-red-600 w-20 h-20 rounded-full flex justify-center items-center"
                onPress={() => {}}
              >
                <Ionicons name="ios-stop" size={32} color="black" />
              </TouchableOpacity>
              <TouchableOpacity
                className="bg-white w-20 h-20 rounded-full flex justify-center items-center"
                onPress={() => {
                  console.log('YEE');
                  setIsPaused(false);
                }}
              >
                <Ionicons name="ios-play" size={32} color="black" />
              </TouchableOpacity>
            </View>
          )}
        </View>
      </SafeAreaView>
    </>
  );
};
