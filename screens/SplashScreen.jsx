import { View, Text, StyleSheet, Image } from 'react-native';
import splashImage from '../assets/splash_image.png';

const SplashScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>¡Que comemos hoy!</Text>
      <Image
        source={splashImage}
        // style={styles.image}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff'
  },
  text: {
    fontSize: 40,
    fontWeight: 'bold',

    textShadowColor: 'darkblue',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 1,
    color: '#7AA2E3',
    textAlign: 'center'
  }
});

export default SplashScreen;
