// src/navigation/index.tsx
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import EventsListScreen from '../screens/EventsListScreen';
import EventFormScreen from '../screens/EventFormScreen';
import { enableScreens } from 'react-native-screens';

enableScreens(true);

export type RootStackParamList = {
  EventsList: undefined;
  EventForm: { mode: 'create' } | { mode: 'edit'; item: any };
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function RootNavigation() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="EventsList"
          component={EventsListScreen}
          options={{ title: 'Eventos' }}
        />
        <Stack.Screen
          name="EventForm"
          component={EventFormScreen}
          options={{ title: 'Formulário' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
