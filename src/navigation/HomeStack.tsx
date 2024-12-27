import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from '../screens/HomeScreen';
import DetailMusicScreen from '../screens/DetailMusic';
import EditMusicScreen from '../screens/EditMusicScreen';

export type HomeStackParamList = {
  MusicCollection: undefined;
  DetailMusic: { id: number };
  EditMusic: { id: number };
};

const Stack = createNativeStackNavigator<HomeStackParamList>();

const HomeStack = () => {
  return (
    <Stack.Navigator initialRouteName="MusicCollection">
      <Stack.Screen name="MusicCollection" component={HomeScreen} />
      <Stack.Screen name="DetailMusic" component={DetailMusicScreen} />
      <Stack.Screen name="EditMusic" component={EditMusicScreen} />
    </Stack.Navigator>
  );
};

export default HomeStack;
