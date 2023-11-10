import { StackActions, useNavigation } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Badge, Icon } from '@rneui/themed';
import * as React from 'react';

import { useAuth } from '@/core';
import { Invites } from '@/screens';
import { GamesList } from '@/screens/games';
import { View } from '@/ui';

export type GamesStackParamList = {
  Games: undefined;
  Invites: { invitedGameIDs: string[] };
};

const Stack = createNativeStackNavigator<GamesStackParamList>();

const GoToInvites = () => {
  const navigation = useNavigation();
  const invitedGameIDs = useAuth().currentUser?.invitedGames || [];
  return (
    <View>
      <Icon
        name={
          invitedGameIDs.length === 0 ? 'mail-outline' : 'mail-open-outline'
        }
        type="ionicon"
        containerStyle={{ padding: 8 }}
        onPress={() =>
          navigation.dispatch(
            StackActions.push('Invites', {
              invitedGameIDs: invitedGameIDs,
            })
          )
        }
      />
      {invitedGameIDs.length > 0 && (
        <Badge
          status="primary"
          value={invitedGameIDs.length}
          containerStyle={{ position: 'absolute', top: 0, left: 20 }}
        />
      )}
    </View>
  );
};

export const GamesNavigator = () => {
  return (
    <Stack.Navigator>
      <Stack.Group
        screenOptions={{
          // eslint-disable-next-line react/no-unstable-nested-components
          headerRight: () => <GoToInvites />,
        }}
      >
        <Stack.Screen name="Games" component={GamesList} />
      </Stack.Group>

      <Stack.Group>
        <Stack.Screen name="Invites" component={Invites} />
      </Stack.Group>
    </Stack.Navigator>
  );
};
