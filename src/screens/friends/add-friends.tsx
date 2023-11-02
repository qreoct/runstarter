import { SearchBar } from '@rneui/themed';
import { FlashList } from '@shopify/flash-list';
import * as React from 'react';
import { Platform } from 'react-native';

import useDebounce from '@/core/hooks/use-debounce';
import type { User } from '@/database';
import { fetchUsers } from '@/database';
import { EmptyList, Text, View } from '@/ui';

// interface User {
//   displayName: string;
//   photoURL: string;
// }

// const users: User[] = [
//   { displayName: 'john', photoURL: 'https://picsum.photos/200' },
//   { displayName: 'alison', photoURL: 'https://picsum.photos/200' },
//   { displayName: 'matilda', photoURL: 'https://picsum.photos/200' },
//   {
//     displayName: 'asldkfjdsf askdj',
//     photoURL: 'https://picsum.photos/200',
//   },
//   { displayName: 'elon musk', photoURL: 'https://picsum.photos/200' },
//   { displayName: 'john tan', photoURL: 'https://picsum.photos/200' },
//   { displayName: 'john lee', photoURL: 'https://picsum.photos/200' },
//   { displayName: 'john major', photoURL: 'https://picsum.photos/200' },
// ];

export const AddFriend = () => {
  const [search, setSearch] = React.useState<string>('');
  const [results, setResults] = React.useState<User[]>([]);
  const [loading, setLoading] = React.useState<boolean>(false);

  const debouncedSearch = useDebounce(search, 500);

  React.useEffect(() => {
    async function makeAPICall() {
      setLoading(true);
      const users = await fetchUsers(debouncedSearch);
      setResults(users);
      setLoading(false);
    }
    makeAPICall();
  }, [debouncedSearch]);

  const updateSearch = (query: string) => {
    setSearch(query);
  };

  const cancelSearch = () => {
    setSearch('');
    setResults([]);
  };

  const renderItem = React.useCallback(
    ({ item }: { item: User }) => (
      <View className="flex-row items-center justify-between py-2">
        <View className="mr-2 flex-row items-center space-x-2">
          {/* <Avatar size="medium" rounded source={{ uri: item.photoURL }} /> */}
          <View className="mb-1">
            <Text className="font-bold">{item.name}</Text>
          </View>
        </View>
      </View>
    ),
    []
  );

  return (
    <View className="flex-1 px-2">
      <SearchBar
        placeholder="Search by name..."
        onChangeText={updateSearch}
        value={search}
        platform={Platform.OS === 'ios' ? 'ios' : 'android'}
        onCancel={cancelSearch}
        showLoading={loading}
      />
      <View className="mx-2 h-full min-h-min">
        {results && results.length > 0 ? (
          <FlashList
            data={results}
            renderItem={renderItem}
            keyExtractor={(_, index) => `item-${index}`}
            ListEmptyComponent={<EmptyList isLoading={loading} />}
            estimatedItemSize={15}
          />
        ) : (
          <></>
        )}
      </View>
    </View>
  );
};
