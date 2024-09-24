import { StyleSheet, View, Text } from 'react-native';
import AddFormRecipe from '../components/AddFormRecipe';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import Constants from 'expo-constants';

const AddRecipeScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.text_title}>Añade una receta</Text>
      <KeyboardAwareScrollView
        contentContainerStyle={styles.scroll_container}
        keyboardShouldPersistTaps='handled'
      >
        <View style={styles.form_container}>
          <AddFormRecipe />
        </View>
      </KeyboardAwareScrollView>
    </View>
  );
};

export default AddRecipeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: Constants.statusBarHeight
  },
  text_title: {
    position: 'absolute',
    top: Constants.statusBarHeight,
    left: 0,
    right: 0,
    marginBottom: 25,
    textShadowColor: 'blue',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 1,
    color: '#7AA2E3',
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 40,
    zIndex: 1,
    backgroundColor: '#eee', // Cambiar fondo a transparente
    paddingVertical: 10
  },
  scroll_container: {
    paddingTop: 20,
    flexGrow: 1
  },
  form_container: {
    flexGrow: 1,
    marginTop: 80, // Aumentar el margen superior para evitar superposición
    marginBottom: 20
  }
});
