import { StyleSheet, View } from 'react-native';
import Constants from 'expo-constants';
import AddFormRecipe from '../components/AddFormRecipe';

const AddRecipeScreen = ({ navigation }) => {
  return (
    <View style={styles.container}>
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
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 40,
    marginBottom: 10
  }
});
