import React, { useState } from 'react';
import { Modal, Text, TouchableOpacity, View } from 'react-native';

import { Run } from '../run';

export const NewRun: React.FC = () => {
  // state to control modal visibility
  const [isModalVisible, setModalVisibility] = useState(false);

  const handlePress = () => {
    setModalVisibility(!isModalVisible);
  };

  return (
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

      <Modal
        visible={isModalVisible}
        transparent={false}
        animationType="slide"
        // onRequestClose={handlePress} // for Android back button
      >
        <View>
          <Run
            onFinish={() => {
              console.log('YO');
              setModalVisibility(false);
            }}
          />
        </View>
      </Modal>
    </View>
  );
};
