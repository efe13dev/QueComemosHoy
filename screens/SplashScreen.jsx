import { View, Text, StyleSheet } from 'react-native';
import splashImage from '../assets/splash_image.png';
import * as Animatable from 'react-native-animatable';

const SplashScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>¡Que comemos hoy! v2.0</Text>
      <Animatable.Image
        animation='bounceIn'
        duration={2000}
        source={splashImage}
        style={styles.image}
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
