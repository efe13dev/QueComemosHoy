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
    marginTop: Constants.statusBarHeight + 10,
    marginBottom: Constants.statusBarHeight + 100,
    fontWeight: 'bold'
  },
  text_title: {
    textShadowColor: 'black',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 1,
    color: '#884A39',
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 40,
    marginVertical: 10
  },
  text_day: {
    color: '#884A39',
    fontWeight: 'bold',
    fontSize: 15
  },
  listContent: {
    paddingTop: 15,
    flexGrow: 1,
    alignItems: 'center'
  },
  buttonContainer: {
    alignItems: 'flex-end',
    marginRight: 10,
    paddingHorizontal: 10,
    paddingBottom: 10
  },
  button: {
    backgroundColor: '#D7C0AE',
    padding: 8,
    borderRadius: 10
  }
});
