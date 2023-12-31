import { Skeleton, Tab, TabView, Text } from '@rneui/themed';
import React from 'react';

import { useAuth } from '@/core';
import { FocusAwareStatusBar, Image, ScrollView, View } from '@/ui';

import AchievementsPage from './achievements-list';
import { RunHistory } from './run-history';

const EmptyState = () => {
  return (
    <View className="flex-1 pt-4">
      <View className="items-center justify-center space-y-4">
        <Skeleton circle width={208} height={208} />
        <View>
          <Skeleton width={300} height={40} />
        </View>
      </View>
    </View>
  );
};

export const Profile = () => {
  const [index, setIndex] = React.useState(0);
  const user = useAuth().currentUser;

  return (
    <>
      <FocusAwareStatusBar />
      {user === null && <EmptyState />}
      {user && (
        <View className="flex-1 pt-4">
          <View className="items-center justify-center">
            <Image
              className="h-52 w-52 rounded-full object-cover"
              source={{
                uri: user.photoURL,
              }}
            />

            <View>
              <Text h1>{user.name} ({user.id.slice(0, 5)})</Text>
            </View>
          </View>

          <Tab
            value={index}
            onChange={(e) => setIndex(e)}
            indicatorStyle={{
              backgroundColor: '#7D7D7D',
              height: 3,
            }}
            variant="default"
            scrollable={false}
          >
            <Tab.Item
              title="Activity"
              titleStyle={{ fontSize: 12, color: '#7D7D7D' }}
            />
            <Tab.Item
              title="Achievements"
              titleStyle={{ fontSize: 12, color: '#7D7D7D' }}
            />
          </Tab>

          <TabView value={index} onChange={setIndex} animationType="spring">
            <TabView.Item>
              <ScrollView className="min-h-full w-screen px-4 pt-4">
                <Text h4>Your Run History</Text>
                <View className="min-h-full pb-8">
                  <RunHistory user={user} />
                </View>
              </ScrollView>
            </TabView.Item>
            <TabView.Item>
              <ScrollView className="min-h-full w-screen p-4">
                <Text h4>Your Achievements</Text>
                <View className="min-h-full pb-8">
                  <AchievementsPage />
                </View>
              </ScrollView>
            </TabView.Item>
          </TabView>
        </View>
      )}
    </>
  );
};
