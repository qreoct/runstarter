import BottomSheet, { BottomSheetFlatList } from '@gorhom/bottom-sheet';
import { Avatar } from '@rneui/base';
import { Button } from '@rneui/themed';
import React, { useCallback, useRef, useState } from 'react';
import { Modal } from 'react-native';

import type { User } from '@/api';
import { fetchUsersWithIds } from '@/api';
import { useAuth } from '@/core';
import { FocusAwareStatusBar, Text, View, TouchableOpacity } from '@/ui';

import { Run } from '../run';
import { RunReport } from '../run_report';

export const NewRun: React.FC = () => {
  // state to control modal visibility
  const [friends, setFriends] = useState<User[]>([]);
  // hook for friend invites bottom sheet
  const sheetRef = useRef<BottomSheet>(null);
  const currentUser = useAuth().currentUser;
  const [isRunModalVisible, setRunModalVisibility] = useState(false);
  // const [runReportId, setRunReportId] = useState<string | null>(null);
  const [runReportId, setRunReportId] = useState<string | null>(
    null
    // 'HdXuDf8HYUc1Z9vZFyqw'
  );

  const handlePress = () => {
    setRunModalVisibility(!isRunModalVisible);
  };

  const renderFriendInviteRow = ({ item }: { item: User }) => {
    return (
      <View className="flex-row items-center justify-between py-2">
        <View className="mr-2 flex-row items-center space-x-2">
          <Avatar
            size="medium"
            rounded
            source={{ uri: item.photoURL ?? 'https://picsum.photos/200' }}
          />
          <View className="mb-1">
            <Text className="font-bold">
              {item.name} {item.id.slice(0, 5)}
            </Text>
          </View>
        </View>
        <Button type="solid">Invite</Button>
      </View>
    );
  };

  const handleSheetChange = useCallback(() => {
    if (!currentUser || currentUser.friends?.length === 0) return;
    // fetchActivityForUsers(ids)
    fetchUsersWithIds(currentUser.friends).then((res) => setFriends(res));
  }, [currentUser]);

  return (
    <>
      <FocusAwareStatusBar hidden={isRunModalVisible}/>
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <TouchableOpacity
          style={{
            backgroundColor: 'green',
            width: 128,
            height: 128,
            borderRadius: 64,
            justifyContent: 'center',
            alignItems: 'center',
          }}
          onPress={handlePress}
        >
          <Text style={{ color: 'white', fontSize: 18 }}>Start</Text>
        </TouchableOpacity>

        <Button
          type="solid"
          radius="lg"
          color="secondary"
          containerStyle={{ marginTop: 16 }}
          onPress={() => {
            sheetRef.current?.expand();
          }}
        >
          Open Invite Modal
        </Button>
        <Modal
          visible={isRunModalVisible}
          transparent={false}
          animationType="slide"
          onRequestClose={handlePress} // for Android back button
        >
          <View>
            <Run
              onFinish={(runId) => {
                setRunModalVisibility(false);
                setRunReportId(runId);
              }}
            />
          </View>
        </Modal>

        <Modal
          visible={!!runReportId}
          transparent={false}
          animationType="slide"
          // onRequestClose={handlePress} // for Android back button
        >
          <View>
            <RunReport
              runId={runReportId!}
              onFinish={() => {
                setRunReportId(null);
              }}
            />
          </View>
        </Modal>

        <BottomSheet
          ref={sheetRef}
          onChange={handleSheetChange}
          snapPoints={['75%']}
          index={-1}
          enablePanDownToClose={true}
        >
          <Text variant="h3" className="text-center font-bold">
            Invite Friends
          </Text>
          <BottomSheetFlatList
            data={friends}
            keyExtractor={(i) => i.id}
            renderItem={renderFriendInviteRow}
            contentContainerStyle={{ paddingHorizontal: 16 }}
          />
        </BottomSheet>
      </View>
    </>
  );
};
