import { Card, Overlay } from '@rneui/base';
import { Text as H1Text } from '@rneui/themed';
import { FlashList } from '@shopify/flash-list';
import React, { useCallback, useState } from 'react';
import { Pressable } from 'react-native';
import { Modal } from 'react-native';

import { Button, EmptyList, Image, Text, View } from '@/ui';

type Achievement = {
  id: number;
  title: string;
  status: 'achieved' | 'unachieved';
  dateEarned: string | null;
  unlockDetails: string;
  imageSource: any;
};

const achievementsData: Achievement[] = [
  {
    id: 1,
    title: 'Night Owl',
    status: 'achieved',
    dateEarned: '2023-11-01',
    unlockDetails: 'Complete a run between 9pm - 5am',
    imageSource: 'https://picsum.photos/200',
  },
  {
    id: 2,
    title: 'Knighttime Knight',
    status: 'unachieved',
    dateEarned: null,
    unlockDetails: 'Complete 25 runs at night \n(8pm - 4am)',
    imageSource: 'https://picsum.photos/200',
  },
  {
    id: 3,
    title: 'Early Bird',
    status: 'unachieved',
    dateEarned: null,
    unlockDetails: 'Complete a run between 5am - 9am',
    imageSource: 'https://picsum.photos/200',
  },
  {
    id: 4,
    title: 'Morning Glory',
    status: 'unachieved',
    dateEarned: null,
    unlockDetails: 'Complete 25 runs in the morning \n(5am - 12nn)',
    imageSource: 'https://picsum.photos/200',
  },
  {
    id: 5,
    title: 'First Steps',
    status: 'achieved',
    dateEarned: '2023-11-01',
    unlockDetails: 'Complete your first run.',
    imageSource: 'https://picsum.photos/200',
  },
];

const AchievementsPage = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedAchievement, setSelectedAchievement] =
    useState<Achievement | null>(null);

  const toggleModal = useCallback((achievement: Achievement | null) => {
    setSelectedAchievement(achievement);
    setModalVisible(achievement === null ? false : true);
  }, []);

  const handlePress = () => {
    setModalVisible(!modalVisible);
  };

  const renderItem = React.useCallback(
    ({ item }: { item: Achievement }) => (
      <Pressable onPress={() => toggleModal(item)}>
        <Card key={item.id}>
          <View className="flex flex-row items-center space-x-4 ">
            <Image
              source={item.imageSource}
              className="h-24 w-24 rounded-full"
              style={{
                opacity: item.status === 'unachieved' ? 0.5 : 1,
              }}
            />
            <View className="flex">
              <Text className="font-bold">
                {item.status === 'unachieved' && '🔒'}
                {item.title}
              </Text>
              {item.status === 'achieved' && (
                <Text className="text-slate-600">
                  Earned on {item.dateEarned}
                </Text>
              )}
            </View>
          </View>
        </Card>
      </Pressable>
    ),
    [toggleModal]
  );

  return (
    <View className="min-h-full">
      <FlashList
        data={achievementsData}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
        ListEmptyComponent={
          <EmptyList isLoading={selectedAchievement === null} />
        }
        estimatedItemSize={15}
      />
      <Overlay
        isVisible={modalVisible}
        onBackdropPress={handlePress}
        ModalComponent={Modal}
        overlayStyle={{
          backgroundColor: 'white',
          borderRadius: 24,
          width: '75%',
        }}
      >
        {selectedAchievement && (
          <View className="m-0 flex items-center space-y-2 rounded-xl bg-white p-8">
            <H1Text h2 h2Style={{ textAlign: 'center' }}>
              {selectedAchievement.title}
            </H1Text>
            <Image
              source={selectedAchievement.imageSource}
              className="h-40 w-40"
            />
            <Text className="text-center">
              {selectedAchievement.unlockDetails}
            </Text>
            {selectedAchievement.status === 'achieved' && (
              <Text className="text-slate-600">
                Earned on {selectedAchievement.dateEarned}
              </Text>
            )}
            <View className="pb-2" />
            <Button label="Close" onPress={() => toggleModal(null)} />
          </View>
        )}
      </Overlay>
    </View>
  );
};

export default AchievementsPage;
