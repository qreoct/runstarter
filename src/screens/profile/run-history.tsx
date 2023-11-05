import { StackActions, useNavigation } from '@react-navigation/native';
import { Card } from '@rneui/base';
import { FlashList } from '@shopify/flash-list';
import React, { useCallback, useEffect } from 'react';

import type { User } from '@/api';
import type { IntervalRun } from '@/database/runs';
import { fetchRunsForUser } from '@/database/runs/fetch-runs';
import { EmptyList, Pressable, Text, timeSince, View } from '@/ui';

interface RunHistoryProps {
  user: User;
}

export const RunHistory = ({ user }: RunHistoryProps) => {
  const [runs, setRuns] = React.useState<IntervalRun[]>([]);
  const navigation = useNavigation();

  useEffect(() => {
    async function getRuns() {
      setRuns(
        (await fetchRunsForUser(user.id)).filter(
          (run) => run.createdAt !== null
        )
      );
    }
    getRuns();
  }, [user.id]);

  const handleCardPress = useCallback(
    (run: IntervalRun) => {
      navigation.dispatch(
        StackActions.push('RunReport', {
          runId: run.id,
        })
      );
    },
    [navigation]
  );

  const renderItem = React.useCallback(
    ({ item }: { item: IntervalRun }) => (
      <Pressable onPress={() => handleCardPress(item)}>
        <Card key={item.createdAt}>
          <View className="flex flex-row items-center justify-between pb-4">
            <View className="flex flex-row items-center space-x-2">
              <Text className="font-bold">Interval Run</Text>
            </View>
            <View>
              <Text variant="xs">
                {timeSince(item.createdAt)?.toLocaleUpperCase()}
              </Text>
            </View>
          </View>
          <View>
            <Text>You have ran {item.intervals?.length ?? 0} intervals.</Text>
          </View>
        </Card>
      </Pressable>
    ),
    [handleCardPress]
  );

  if (user === undefined) {
    return;
  }

  return (
    <FlashList
      data={runs}
      renderItem={renderItem}
      keyExtractor={(_, index) => `item-${index}`}
      ListEmptyComponent={<EmptyList isLoading={user === undefined} />}
      estimatedItemSize={15}
    />
  );
};
