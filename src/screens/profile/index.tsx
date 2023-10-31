import { Tab, TabView, Text } from '@rneui/themed';
import React from 'react';

import { FocusAwareStatusBar, Image, ScrollView, View } from '@/ui';

export const Profile = () => {
  const [index, setIndex] = React.useState(0);

  return (
    <>
      <FocusAwareStatusBar />
      <View className="flex-1 pt-4">
        <View className="items-center justify-center">
          <Image
            className="h-52 w-52 rounded-full object-cover"
            source={{
              uri: 'https://images.unsplash.com/photo-1524758631624-e2822e304c36?ixlib=rb-1.2.1&ixid=MnwxMjA3fDF8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2070&q=80',
            }}
          />

          <View>
            <Text h1>John Doe</Text>
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
              <Text h1>Activity</Text>
            </ScrollView>
          </TabView.Item>
          <TabView.Item>
            <ScrollView className="px-4">
              <Text h1>Achievements</Text>
            </ScrollView>
          </TabView.Item>
        </TabView>
      </View>
    </>
  );
};
