import { Ionicons } from '@expo/vector-icons';
import Geolocation from '@react-native-community/geolocation';
import { addDoc, collection } from 'firebase/firestore';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { pauseGame, resumeGame, socket } from 'server/server-utils';

import type { User } from '@/api';
import {
  playEndSound,
  playIntervalSound,
  playPauseSound,
  playRestSound,
  playResumeSound,
} from '@/audio';
import { auth, db } from '@/database/firebase-config';
import type { Coord, Interval, PreSavedIntervalRun } from '@/database/runs';
import {
  Image,
  SafeAreaView,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from '@/ui';

export interface RunProps {
  gameId: string;
  players: User[];
  onFinish: (id: string | null) => void;
}

/* eslint-disable max-params */
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

function calcDistance(a: Coord, b: Coord): number {
  return calculateDistance(a.latitude, a.longitude, b.latitude, b.longitude);
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

/* eslint-disable max-lines-per-function */
export const Run = (props: RunProps) => {
  const REST_DURATION_MS = 60_000;
  const INTERVAL_DURATION_MS = 60_000;
  const TOTAL_INTERVALS = 8;

  const [isRunning, setIsRunning] = useState(true);
  const [isPaused, setIsPaused] = useState(false);
  const [isCountdown, setIsCountdown] = useState(false);
  const [pauser, setPauser] = useState('');
  const [millisecondsLeft, setMillisecondsLeft] =
    useState(INTERVAL_DURATION_MS);
  const [currentRestSoundPlayed, setCurrentRestSoundPlayed] = useState(false);
  const [currentIntervalSoundPlayed, setCurrentIntervalSoundPlayed] =
    useState(false);
  const [route, setRoute] = useState<Coord[]>([]);
  const [distanceMeters, setDistanceMeters] = useState(0);
  const [previousIntervals, setPreviousIntervals] = useState<Interval[]>([]);
  const latestCoordsRef = useRef<Coord | null>(null);

  // Effects triggered by server events
  useEffect(() => {
    if (socket) {
      const handleGamePaused = (data: any) => {
        playPauseSound();
        setIsPaused(true);
        setPauser(data.pauser);
      };

      const handleGameResumed = (_data: any) => {
        playResumeSound();
        setIsCountdown(true);
        setTimeout(() => {
          setIsCountdown(false);
          setIsPaused(false);
          setPauser('');
        }, 5000);
      };

      socket.on('game_paused', handleGamePaused);
      socket.on('game_resumed', handleGameResumed);

      return () => {
        if (socket) {
          socket.off('game_paused', handleGamePaused);
          socket.off('game_resumed', handleGameResumed);
        }
      };
    }
  }, [props.gameId]);

  useEffect(() => {
    if (isRunning && !isPaused) {
      const watchId = Geolocation.watchPosition(
        (position) => {
          const oldCoords = latestCoordsRef.current;
          const newCoords = position.coords;
          latestCoordsRef.current = newCoords;
          setRoute((routeToSet) => [...routeToSet, newCoords]);
          if (oldCoords) {
            setDistanceMeters(
              (distance) => distance + calcDistance(oldCoords, newCoords)
            );
          }
        },
        (error) => console.warn(error),
        { enableHighAccuracy: true, distanceFilter: 10 }
      );
      return () => {
        Geolocation.clearWatch(watchId);
      };
    } else {
      latestCoordsRef.current = null;
    }
  }, [isRunning, isPaused]);

  function lastAvgPace() {
    if (isRunning) {
      // use the pace from the API when possible
      if (latestCoordsRef.current && latestCoordsRef.current.speed) {
        const metersPerSecond = latestCoordsRef.current.speed;
        return formatAvgPace(1000, metersPerSecond);
      } else {
        // else calculate it manually.
        return formatAvgPace(
          INTERVAL_DURATION_MS - millisecondsLeft,
          distanceMeters
        );
      }
    } else if (previousIntervals.length > 0) {
      const interval = previousIntervals[previousIntervals.length - 1];
      return formatAvgPace(INTERVAL_DURATION_MS, interval.distanceMeters);
    } else {
      return formatAvgPace(0, 0);
    }
  }

  function lastDistance() {
    let meters = 0;
    if (isRunning) {
      meters = distanceMeters;
    } else if (previousIntervals.length > 0) {
      const interval = previousIntervals[previousIntervals.length - 1];
      meters = interval.distanceMeters;
    }
    return meters
      .toFixed(1)
      .toString()
      .replace(/(\d)(?=(\d\d\d)+(?!\d))/g, '$1,'); // commas every third digit
  }

  const saveAndEndRun = useCallback(
    async (run: PreSavedIntervalRun) => {
      const uid = auth.currentUser?.uid;
      if (!uid) {
        console.error('No user logged in.');
        return;
      }
      // Play end sound
      playEndSound();
      const collectionRef = collection(db, 'users', uid, 'runs');
      const docRef = await addDoc(collectionRef, run);
      console.log('Document saved with ID: ', docRef.id);
      props.onFinish(docRef.id);
    },
    [props]
  );

  useEffect(() => {
    if (isPaused) {
      return;
    }

    if (isRunning) {
      const pollMs = 1000;
      const timer = setTimeout(() => {
        const newMillisecondsLeft = millisecondsLeft - pollMs;
        if (newMillisecondsLeft <= 5000 && !currentRestSoundPlayed) {
          // Play interval sound
          playRestSound();
          setCurrentRestSoundPlayed(true);
        }
        if (newMillisecondsLeft >= 0) {
          // interval still happening
          setMillisecondsLeft(newMillisecondsLeft);
        } else {
          // interval ended. transition to rest or end the run.
          const interval: Interval = {
            durationMs: INTERVAL_DURATION_MS,
            distanceMeters,
            route,
          };

          if (previousIntervals.length + 1 < TOTAL_INTERVALS) {
            // Transition to rest
            setPreviousIntervals((intervals) => [...intervals, interval]);
            setIsRunning(false);
            setRoute([]);
            setDistanceMeters(0);
            latestCoordsRef.current = null;
            setMillisecondsLeft(REST_DURATION_MS);
            setCurrentRestSoundPlayed(false);
          }

          // TODO: implement an end state
          if (previousIntervals.length + 1 === TOTAL_INTERVALS) {
            // End the run
            const intervals = [...previousIntervals, interval];
            const run: PreSavedIntervalRun = {
              intervals,
              createdAt: Date.now(),
            };
            saveAndEndRun(run);
          }
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
        if (newMillisecondsLeft <= 5000 && !currentIntervalSoundPlayed) {
          // Play interval sound
          playIntervalSound();
          setCurrentIntervalSoundPlayed(true);
        }
        if (newMillisecondsLeft >= 0) {
          // rest still happening
          // console.log('REST', { newMillisecondsLeft });
          setMillisecondsLeft(newMillisecondsLeft);
        } else {
          // rest ended. transition to interval.
          setIsRunning(true);
          setMillisecondsLeft(INTERVAL_DURATION_MS);
          setCurrentIntervalSoundPlayed(false);
        }
      }, pollMs);
      return () => clearInterval(timer);
    }
  }, [
    isRunning,
    isPaused,
    millisecondsLeft,
    distanceMeters,
    route,
    previousIntervals,
    saveAndEndRun,
  ]);

  return (
    <>
      <SafeAreaView className="flex h-full justify-between bg-black">
        <View className="flex-cols flex py-4">
          <View className="flex flex-row justify-between gap-x-4 px-8">
            <View className="w-22 items-center">
              <Text className="text-2xl font-bold text-white">
                {lastAvgPace()}
              </Text>
              <Text className="font-semibold text-white/50">Pace</Text>
            </View>
            <View className="w-22 items-center">
              <Text className="text-2xl font-bold text-white">
                {previousIntervals.length + 1}
              </Text>
              <Text className="font-semibold text-white/50">Interval</Text>
            </View>
            <View className="w-22 items-center">
              <Text className="text-2xl font-bold text-white">
                {lastDistance()}
              </Text>
              <Text className="font-semibold text-white/50">Metres</Text>
            </View>
          </View>
        </View>

        <View className="flex items-center">
          <Text className="text-8xl font-extrabold italic text-white">
            {formatTimeElapsed(millisecondsLeft)}
          </Text>
          <Text className="text-xl font-semibold text-white/50">
            {isPaused
              ? pauser + ' has paused the game'
              : isRunning
              ? 'Time'
              : 'Rest'}
          </Text>
        </View>

        <View className="flex items-center justify-center">
          <ScrollView
            horizontal={true}
            showsHorizontalScrollIndicator={false}
            className="flex gap-x-4 px-4"
          >
            {props.players.map((player, index) => (
              <View
                key={index}
                className="flex w-24 items-center justify-center gap-y-2"
              >
                <Image
                  source={{
                    uri: player.photoURL ?? 'https://picsum.photos/200',
                  }}
                  className="h-20 w-20 rounded-full"
                />
                <Text
                  className="text-xs font-normal text-neutral-200"
                  numberOfLines={1}
                >
                  {player.name}
                </Text>
              </View>
            ))}
          </ScrollView>
        </View>

        <View className="flex items-center py-8">
          {!isPaused ? (
            <TouchableOpacity
              className="flex h-20 w-20 items-center justify-center rounded-full bg-white"
              disabled={isCountdown}
              onPress={() => {
                setIsPaused(true);
                pauseGame(props.gameId);
              }}
            >
              <Ionicons name="ios-pause" size={32} color="black" />
            </TouchableOpacity>
          ) : (
            <View className="flex flex-row gap-20">
              <TouchableOpacity
                className={`flex h-20 w-20 items-center justify-center rounded-full ${
                  isCountdown ? 'bg-gray-500' : 'bg-red-600'
                }`}
                disabled={isCountdown}
                onPress={() => {
                  const interval: Interval = {
                    durationMs: INTERVAL_DURATION_MS,
                    distanceMeters,
                    route,
                  };
                  const intervals = [...previousIntervals, interval];
                  const run: PreSavedIntervalRun = {
                    intervals,
                    createdAt: Date.now(),
                  };
                  saveAndEndRun(run);
                }}
              >
                <Ionicons name="ios-stop" size={32} color="black" />
              </TouchableOpacity>
              <TouchableOpacity
                className={`flex h-20 w-20 items-center justify-center rounded-full ${
                  isCountdown ? 'bg-gray-300' : 'bg-white'
                }`}
                disabled={isCountdown}
                onPress={() => {
                  resumeGame(props.gameId);
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
