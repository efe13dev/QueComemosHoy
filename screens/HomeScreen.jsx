import { View, Text, StyleSheet, StatusBar } from 'react-native';

import { GenerateMenu } from '../components/GenerateMenu';
import Constants from 'expo-constants';

const HomeScreen = () => {
  return (
    <View style={styles.container}>
      <StatusBar
        barStyle='dark-content'
        translucent
        backgroundColor='transparent'
      />
      <Text style={styles.text_title}>Menú semanal</Text>
      <GenerateMenu />
    </View>
  );
};

export default HomeScreen;
const styles = StyleSheet.create({
  container: {
    flex: 1, // Añadido para ocupar toda la pantalla
    fontWeight: 'bold',
    paddingTop: Constants.statusBarHeight
  },
  text_title: {
    textShadowColor: 'darkblue',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 1,
    color: '#7AA2E3',
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 40,
    marginVertical: 10
  }
});
