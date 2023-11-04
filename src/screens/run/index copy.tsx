// import Geolocation from '@react-native-community/geolocation';
// import { Audio, InterruptionModeAndroid, InterruptionModeIOS } from 'expo-av';
// import {
//   FieldValue,
//   addDoc,
//   collection,
//   serverTimestamp,
// } from 'firebase/firestore';
// import React, { useEffect, useRef, useState } from 'react';
// import { Ionicons } from '@expo/vector-icons';

// import { auth, db } from '@/database/firebase-config';
// import {
//   Button,
//   FocusAwareStatusBar,
//   SafeAreaView,
//   ScrollView,
//   Text,
//   TouchableOpacity,
//   View,
//   Pause as PauseIcon,
//   Image,
// } from '@/ui';

// export interface Coords {
//   latitude: number;
//   longitude: number;
// }

// export interface PositionRecord {
//   coords: Coords;
//   distance: number;
// }

// export interface Run {
//   timeElapsed: number;
//   distance: number;
//   timestamp: FieldValue;
//   route: PositionRecord[];
// }

// export interface RunProps {
//   onFinish: (id: string | null) => void;
// }

// const audioFiles: { [key: number]: any } = {
//   0.5: require('../../../assets/distances/0.5.wav'),
//   1.0: require('../../../assets/distances/1.0.wav'),
//   1.5: require('../../../assets/distances/1.5.wav'),
//   2.0: require('../../../assets/distances/2.0.wav'),
//   2.5: require('../../../assets/distances/2.5.wav'),
//   3.0: require('../../../assets/distances/3.0.wav'),
//   3.5: require('../../../assets/distances/3.5.wav'),
//   4.0: require('../../../assets/distances/4.0.wav'),
//   4.5: require('../../../assets/distances/4.5.wav'),
//   5.0: require('../../../assets/distances/5.0.wav'),
// };

// /* eslint-disable max-lines-per-function */
// export const Run = (props: RunProps) => {
//   const [intervalIndex, setIntervalIndex] = useState<number>(1);
//   const [isResting, setIsResting] = useState<boolean>(false);
//   const restDuration = 60;
//   const intervalDuration = 60;
//   const totalIntervals = 8;

//   const [distance, setDistance] = useState<number>(0);
//   const [timeElapsed, setTimeElapsed] = useState<number>(0);
//   const previousPositionRef = useRef<Coords | null>(null);
//   const [positionRecords, setPositionRecords] = useState<PositionRecord[]>([]);
//   const [isRunning, setIsRunning] = useState<boolean>(true);
//   const playedDistancesRef = useRef(new Set<number>());

//   /* eslint-disable max-params */
//   const calculateDistance = (
//     lat1: number,
//     lon1: number,
//     lat2: number,
//     lon2: number
//   ): number => {
//     const R = 6371e3;
//     const dLat = ((lat2 - lat1) * Math.PI) / 180;
//     const dLon = ((lon2 - lon1) * Math.PI) / 180;
//     const a =
//       Math.sin(dLat / 2) * Math.sin(dLat / 2) +
//       Math.cos((lat1 * Math.PI) / 180) *
//         Math.cos((lat2 * Math.PI) / 180) *
//         Math.sin(dLon / 2) *
//         Math.sin(dLon / 2);
//     const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
//     return R * c;
//   };
//   /* eslint-enable max-params */

//   const playSound = async (dist: number) => {
//     if (dist in audioFiles) {
//       let soundFile = audioFiles[dist];
//       const soundObject = new Audio.Sound();
//       try {
//         await soundObject.loadAsync(soundFile, { shouldPlay: true });
//         await soundObject.setPositionAsync(0);
//         await soundObject.playAsync();
//       } catch (error) {
//         console.log('Error playing sound:', error);
//       }
//     }
//   };

//   const profileImages = [
//     'https://ph-avatars.imgix.net/18280/d1c43757-f761-4a37-b933-c4d84b461aea?auto=compress&codec=mozjpeg&cs=strip&auto=format&w=120&h=120&fit=crop&dpr=2',
//     'https://ph-avatars.imgix.net/18280/d1c43757-f761-4a37-b933-c4d84b461aea?auto=compress&codec=mozjpeg&cs=strip&auto=format&w=120&h=120&fit=crop&dpr=2',
//     'https://ph-avatars.imgix.net/18280/d1c43757-f761-4a37-b933-c4d84b461aea?auto=compress&codec=mozjpeg&cs=strip&auto=format&w=120&h=120&fit=crop&dpr=2',
//     'https://ph-avatars.imgix.net/18280/d1c43757-f761-4a37-b933-c4d84b461aea?auto=compress&codec=mozjpeg&cs=strip&auto=format&w=120&h=120&fit=crop&dpr=2',
//     'https://ph-avatars.imgix.net/18280/d1c43757-f761-4a37-b933-c4d84b461aea?auto=compress&codec=mozjpeg&cs=strip&auto=format&w=120&h=120&fit=crop&dpr=2',
//   ];

//   useEffect(() => {
//     if (isRunning && !isResting && intervalIndex <= totalIntervals) {
//       const intervalTimer = setInterval(() => {
//         setTimeElapsed((prevTime) => {
//           if (prevTime >= intervalDuration) {
//             clearInterval(intervalTimer);
//             setIsResting(true);
//             return 0; // Reset the timer for the rest period
//           }
//           return prevTime + 1;
//         });
//       }, 1000);

//       return () => clearInterval(intervalTimer);
//     }

//     if (isRunning && isResting) {
//       const restTimer = setInterval(() => {
//         setTimeElapsed((prevTime) => {
//           if (prevTime >= restDuration) {
//             clearInterval(restTimer);
//             setIsResting(false);
//             setIntervalIndex((prevIndex) => prevIndex + 1);
//             return 0; // Reset the timer for the next interval
//           }
//           return prevTime + 1;
//         });
//       }, 1000);

//       return () => clearInterval(restTimer);
//     }
//   }, [isRunning, isResting, intervalIndex]);

//   useEffect(() => {
//     if (isRunning) {
//       // const timer = setInterval(() => {
//       //   setTimeElapsed((prevTime) => prevTime + 1);
//       // }, 1000);

//       // const testtimer = setInterval(() => {
//       //   playSound(0.5);
//       // }, 3000);

//       async function setAudioMode() {
//         await Audio.setAudioModeAsync({
//           allowsRecordingIOS: false,
//           staysActiveInBackground: true,
//           interruptionModeIOS: InterruptionModeIOS.DuckOthers,
//           playsInSilentModeIOS: true,
//           shouldDuckAndroid: true,
//           interruptionModeAndroid: InterruptionModeAndroid.DuckOthers,
//           playThroughEarpieceAndroid: false,
//         });
//       }

//       setAudioMode();

//       const watchId = Geolocation.watchPosition(
//         (position) => {
//           if (!previousPositionRef.current) {
//             previousPositionRef.current = {
//               latitude: position.coords.latitude,
//               longitude: position.coords.longitude,
//             };
//           } else {
//             const dist = calculateDistance(
//               previousPositionRef.current.latitude,
//               previousPositionRef.current.longitude,
//               position.coords.latitude,
//               position.coords.longitude
//             );
//             setDistance((prevDistance) => {
//               const updatedDistance = prevDistance + dist;
//               const updatedKm = updatedDistance / 1000; // Convert to kilometers
//               const prevKm = prevDistance / 1000; // Convert to kilometers

//               // Check in reverse from updatedKm to prevKm for the furthest milestone crossed
//               for (
//                 let milestone = Math.floor(updatedKm * 2) / 2;
//                 milestone >= prevKm;
//                 milestone -= 0.5
//               ) {
//                 if (!playedDistancesRef.current.has(milestone)) {
//                   playSound(milestone);
//                   playedDistancesRef.current.add(milestone);
//                   break; // Exit once the latest milestone sound is played
//                 }
//               }
//               return updatedDistance;
//             });
//             previousPositionRef.current = {
//               latitude: position.coords.latitude,
//               longitude: position.coords.longitude,
//             };
//             setPositionRecords((prevRecords) => {
//               const newRecord = {
//                 coords: {
//                   latitude: position.coords.latitude,
//                   longitude: position.coords.longitude,
//                 },
//                 distance: dist,
//               };
//               return [...prevRecords, newRecord];
//             });

//             console.log('position', position, 'distance', dist);
//           }
//         },
//         (error) => console.warn(error),
//         { enableHighAccuracy: true, distanceFilter: 10 }
//       );
//       return () => {
//         Geolocation.clearWatch(watchId);
//         // clearInterval(timer);
//         // clearInterval(testtimer);
//       };
//     }
//   }, [isRunning]);

//   const handleFinish = async () => {
//     try {
//       // Stop tracking
//       setIsRunning(false);

//       // Get current user's UID
//       const uid = auth.currentUser?.uid;
//       if (!uid) {
//         console.error('No user logged in.');
//         return;
//       }

//       // Prepare data for Firestore
//       const runData: Run = {
//         timeElapsed,
//         distance,
//         timestamp: serverTimestamp(),
//         route: positionRecords,
//       };

//       // Reference to the current user's runs sub-collection
//       const runsCollectionRef = collection(db, 'users', uid, 'runs');

//       // Save to Firestore
//       const docRef = await addDoc(runsCollectionRef, runData);

//       console.log('Document saved with ID: ', docRef.id);
//       props.onFinish(docRef.id);
//     } catch (error) {
//       console.error('Error saving to Firestore: ', error);
//       props.onFinish(null);
//     }
//   };

//   function formatAvgPace() {
//     if (timeElapsed === 0 || distance === 0) {
//       return '0\'00"';
//     }
//     const avgPace = timeElapsed / 60 / (distance / 1000);
//     const minutes = Math.floor(avgPace);
//     const seconds = Math.round((avgPace - minutes) * 60);
//     return `${minutes}'${seconds.toString().padStart(2, '0')}"`;
//   }

//   return (
//     <>
//       <SafeAreaView className="h-full flex bg-black justify-between">
//         <View className="py-4 flex flex-1 flex-cols justify-between">
//           <View className="px-8 flex flex-row justify-between gap-x-4">
//             <View className="items-center w-22">
//               <Text className="text-2xl text-white font-bold">
//                 {formatAvgPace()}
//               </Text>
//               <Text className="text-white/50 font-semibold">Avg. Pace</Text>
//             </View>
//             <View className="items-center w-22">
//               <Text className="text-2xl text-white font-bold">
//                 {intervalIndex}
//               </Text>
//               <Text className="text-white/50 font-semibold">Interval</Text>
//             </View>
//             <View className="items-center w-22">
//               <Text className="text-2xl text-white font-bold">
//                 {Math.floor(timeElapsed / 60)
//                   .toString()
//                   .padStart(2, '0')}
//                 :{(timeElapsed % 60).toString().padStart(2, '0')}
//               </Text>
//               <Text className="text-white/50 font-semibold">Time</Text>
//             </View>
//           </View>

//           <View className="flex items-center">
//             <Text className="text-8xl text-white font-extrabold italic">
//               {Math.floor(timeElapsed / 60)
//                 .toString()
//                 .padStart(2, '0')}
//               :{(timeElapsed % 60).toString().padStart(2, '0')}
//             </Text>
//             <Text className="text-xl text-white/50 font-semibold">
//               {isResting ? 'Rest' : `Time`}
//             </Text>
//           </View>

//           <View>
//             <ScrollView
//               horizontal={true}
//               showsHorizontalScrollIndicator={false}
//               className="px-6 flex gap-x-4"
//             >
//               {profileImages.map((image, index) => (
//                 <Image
//                   key={index}
//                   source={{ uri: image }}
//                   className="w-20 h-20 rounded-full"
//                 />
//               ))}
//             </ScrollView>
//           </View>
//         </View>

//         <View className="flex items-center py-8">
//           {isRunning ? (
//             <TouchableOpacity
//               className="bg-white w-20 h-20 rounded-full flex justify-center items-center"
//               onPress={() => {
//                 setIsRunning(false);
//               }}
//             >
//               <Ionicons name="ios-pause" size={32} color="black" />
//             </TouchableOpacity>
//           ) : (
//             <View className="flex flex-row gap-20">
//               <TouchableOpacity
//                 className="bg-red-600 w-20 h-20 rounded-full flex justify-center items-center"
//                 onPress={() => {
//                   handleFinish();
//                 }}
//               >
//                 <Ionicons name="ios-stop" size={32} color="black" />
//               </TouchableOpacity>
//               <TouchableOpacity
//                 className="bg-white w-20 h-20 rounded-full flex justify-center items-center"
//                 onPress={() => {
//                   setIsRunning(true);
//                 }}
//               >
//                 <Ionicons name="ios-play" size={32} color="black" />
//               </TouchableOpacity>
//             </View>
//           )}
//         </View>
//       </SafeAreaView>
//     </>
//   );
// };
// /* eslint-enable max-lines-per-function */
