import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import RNPickerSelect from 'react-native-picker-select';

const WeekDayPicker = ({ day, handleChange, recipesName, selectedRecipe }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.week_day_name}>{day}:</Text>
      <RNPickerSelect
        value={selectedRecipe}
        // style={pickerSelectStyles}
        placeholder={{ label: 'Selecciona comida...', value: null }}
        onValueChange={(value) => handleChange(day, value)}
        items={recipesName}
        useNativeAndroidPickerStyle
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 55,
    flexDirection: 'column',
    marginBottom: 15,

    paddingHorizontal: 15
  },
  week_day_name: {
    textShadowColor: 'blue',
    textShadowOffset: { width: 0.5, height: 0.5 },
    textShadowRadius: 0.5,
    color: '#7AA2E3',
    marginLeft: 10,
    fontSize: 18,
    fontWeight: 'bold'
  }
});

/* const pickerSelectStyles = StyleSheet.create({
  inputAndroid: {
    paddingHorizontal: 10,
    paddingVertical: 8,

    borderColor: 'gray',
    borderRadius: 8,
    color: 'black',
    paddingRight: 30
  }
}); */

export default WeekDayPicker;
