import { View, Text, StyleSheet } from 'react-native';
import Constants from 'expo-constants';
import { GenerateMenu } from '../components/GenerateMenu';

const HomeScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.text_title}>Menú semanal</Text>
      <GenerateMenu />
    </View>
  );
};

export default HomeScreen;
const styles = StyleSheet.create({
  container: {
    marginTop: Constants.statusBarHeight,
    fontWeight: 'bold'
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
