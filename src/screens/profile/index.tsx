import { Skeleton, Tab, TabView, Text } from '@rneui/themed';
import React from 'react';

import { useAuth } from '@/core';
import { FocusAwareStatusBar, Image, ScrollView, View } from '@/ui';

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
              <Text h1>{user.name}</Text>
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
              <ScrollView className="px-4">
                <Text h1>Current User</Text>
                <Text>{JSON.stringify(user)}</Text>
              </ScrollView>
            </TabView.Item>
            <TabView.Item>
              <ScrollView className="px-4">
                <Text h1>Achievements</Text>
              </ScrollView>
            </TabView.Item>
          </TabView>
        </View>
      )}
    </>
  );
};
