import { StyleSheet, Text, View } from 'react-native';
import Constants from 'expo-constants';

const RandomRecipes = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.text_title}>RandomRecipes</Text>
    </View>
  );
};

export default RandomRecipes;
const styles = StyleSheet.create({
  container: {
    marginTop: Constants.statusBarHeight,
    flexGrow: 1
  },
  text_title: {
    textAlign: 'center',
    fontWeight: 'bold',
    textDecorationLine: 'underline',
    fontSize: 40,
    marginBottom: 10
  }
});
