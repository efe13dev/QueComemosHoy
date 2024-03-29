import { StyleSheet, View, Text } from 'react-native';
import Constants from 'expo-constants';
import AddFormRecipe from '../components/AddFormRecipe';

const AddRecipeScreen = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.text_title}>Añade una receta</Text>
      <AddFormRecipe />
    </View>
  );
};

export default AddRecipeScreen;
const styles = StyleSheet.create({
  container: {
    marginTop: Constants.statusBarHeight,
    flexGrow: 1
  },

  text_title: {
    marginTop: 10,
    textShadowColor: 'black',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 1,
    color: '#884A39',
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 40
  }
});
