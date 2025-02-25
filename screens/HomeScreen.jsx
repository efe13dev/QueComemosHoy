import { MaterialCommunityIcons } from '@expo/vector-icons';
import Constants from 'expo-constants';
import React from 'react';
import { StatusBar, StyleSheet, View } from 'react-native';
import { GenerateMenu } from '../components/GenerateMenu';

export default function HomeScreen() {
  return (
    <View style={styles.container}>
      <StatusBar
        barStyle="dark-content"
        backgroundColor="transparent"
        translucent
      />
      <View style={styles.iconContainer}>
        <MaterialCommunityIcons
          name="chef-hat"
          size={50}
          color="#8B4513"
          style={styles.icon}
        />
      </View>
      <GenerateMenu />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF5E6',
  },
  iconContainer: {
    alignItems: 'center',
    paddingTop: Constants.statusBarHeight,
    paddingBottom: 10,
  },
  icon: {
    shadowColor: '#8B4513',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
});
