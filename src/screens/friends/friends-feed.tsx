import { useNavigation } from '@react-navigation/native';
import { Card } from '@rneui/base';
import { Button } from '@rneui/themed';
import { FlashList } from '@shopify/flash-list';
import React, { useEffect } from 'react';

import {
  EmptyList,
  FocusAwareStatusBar,
  Image,
  ScrollView,
  Text,
  View,
} from '@/ui';

interface User {
  name: string;
  message: string;
  avatar: string;
  timestamp: string;
}

const activity: User[] = [
  {
    name: 'Jane Doe',
    message: 'I ran 5.2km and won in Duck Duck Chase!',
    avatar:
      'https://images.pexels.com/photos/598745/pexels-photo-598745.jpeg?crop=faces&fit=crop&h=200&w=200&auto=compress&cs=tinysrgb',
    timestamp: '5H',
  },
  {
    name: 'Alice Tan',
    message: 'I ran 3.2km and won in Duck Duck Chase!',
    avatar:
      'https://images.pexels.com/photos/863926/pexels-photo-863926.jpeg?crop=faces&fit=crop&h=200&w=200&auto=compress&cs=tinysrgb',
    timestamp: '6H',
  },
  {
    name: 'Steve Ng',
    message: 'I unlocked a new achievement: Night Owl!',
    avatar:
      'https://images.pexels.com/photos/235922/pexels-photo-235922.jpeg?crop=faces&fit=crop&h=200&w=200&auto=compress&cs=tinysrgb',
    timestamp: '11H',
  },
  {
    name: 'Alice Tan',
    message: 'I unlocked a new achievement: Baby Steps!',
    avatar:
      'https://images.pexels.com/photos/863926/pexels-photo-863926.jpeg?crop=faces&fit=crop&h=200&w=200&auto=compress&cs=tinysrgb',
    timestamp: '19H',
  },
];

export const FriendsFeed = () => {
  const { navigate } = useNavigation();
  const [loading, setLoading] = React.useState<boolean>(true);

  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  }, []);

  const renderItem = React.useCallback(
    ({ item }: { item: User }) => (
      <Card key={item.name}>
        <View className="flex flex-row items-center justify-between pb-4">
          <View className="flex flex-row items-center space-x-2">
            <Image
              className="h-10 w-10 rounded-full"
              contentFit="cover"
              source={{ uri: item.avatar }}
            />
            <Text className="font-bold">{item.name}</Text>
          </View>
          <View>
            <Text variant="xs">{item.timestamp}</Text>
          </View>
        </View>
        <View>
          <Text>{item.message}</Text>
        </View>
      </Card>
    ),
    []
  );

  return (
    <>
      <FocusAwareStatusBar />
      <ScrollView>
        <View className="h-screen flex-1 px-2 pt-2">
          <Button type="clear" onPress={() => navigate('FriendRequests')}>
            Friend Requests (1)
          </Button>
          <FlashList
            data={activity}
            renderItem={renderItem}
            keyExtractor={(_, index) => `item-${index}`}
            ListEmptyComponent={<EmptyList isLoading={loading} />}
            estimatedItemSize={15}
          />
        </View>
      </ScrollView>
    </>
  );
};
