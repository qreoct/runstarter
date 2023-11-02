import { Avatar, Button } from '@rneui/themed';
import { FlashList } from '@shopify/flash-list';
import * as React from 'react';

import { EmptyList, Text, View } from '@/ui';

interface User {
  displayName: string;
  photoURL: string;
}

export const FriendRequests = () => {
  const [results, setResults] = React.useState<User[]>([]);
  const [loading, setLoading] = React.useState<boolean>(true);

  React.useEffect(() => {
    fetchData(setResults);
  }, []);

  const fetchData = async (cb: (_: User[]) => void) => {
    // const res = await fetchSearchResults(query);
    setTimeout(() => {
      const res: User[] = [
        { displayName: 'john', photoURL: 'https://picsum.photos/200' },
        { displayName: 'alison', photoURL: 'https://picsum.photos/200' },
        { displayName: 'matilda', photoURL: 'https://picsum.photos/200' },
        {
          displayName: 'asldkfjdsf askdj',
          photoURL: 'https://picsum.photos/200',
        },
        { displayName: 'elon musk', photoURL: 'https://picsum.photos/200' },
        { displayName: 'john tan', photoURL: 'https://picsum.photos/200' },
        { displayName: 'john lee', photoURL: 'https://picsum.photos/200' },
        { displayName: 'john major', photoURL: 'https://picsum.photos/200' },
      ];
      cb(res);
      setLoading(false);
    }, 1000);
  };

  const renderItem = React.useCallback(
    ({ item }: { item: User }) => (
      <View className="flex-row items-center justify-between py-2">
        <View className="mr-2 flex-row items-center space-x-2">
          <Avatar size="medium" rounded source={{ uri: item.photoURL }} />
          <View className="mb-1">
            <Text className="font-bold">{item.displayName}</Text>
          </View>
        </View>
        <View className="flex-row">
          <Button type="solid">Accept</Button>
          <Button type="clear">Reject</Button>
        </View>
      </View>
    ),
    []
  );

  return (
    <View className="flex-1 px-2">
      <View className="mx-2 h-full min-h-min">
        <FlashList
          data={results}
          renderItem={renderItem}
          keyExtractor={(_, index) => `item-${index}`}
          ListEmptyComponent={<EmptyList isLoading={loading} />}
          estimatedItemSize={15}
        />
      </View>
    </View>
  );
};
