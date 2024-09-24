import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import RNPickerSelect from 'react-native-picker-select';

const WeekDayPicker = ({ day, handleChange, recipesName, selectedRecipe }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.week_day_name}>{day}:</Text>
      <RNPickerSelect
        value={selectedRecipe}
        style={pickerSelectStyles}
        placeholder={{ label: 'Selecciona comida...', value: null }}
        onValueChange={(value) => handleChange(day, value)}
        items={recipesName}
        useNativeAndroidPickerStyle={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 55,
    flexDirection: 'column',
    marginBottom: 15,
    paddingHorizontal: 15,
    backgroundColor: '#f4f4f4',
    borderRadius: 10,
    borderColor: '#ddd',
    justifyContent: 'center'
  },
  week_day_name: {
    textShadowColor: 'rgba(0, 0, 0, 0.1)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 1,
    color: '#333',
    marginLeft: 10,
    fontSize: 18,
    fontWeight: 'bold'
  }
});

const pickerSelectStyles = StyleSheet.create({
  inputAndroid: {
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 8,
    color: 'black',
    paddingRight: 30,
    backgroundColor: '#fff'
  },
  inputIOS: {
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 8,
    color: 'black',
    paddingRight: 30,
    backgroundColor: '#fff'
  }
});

export default WeekDayPicker;
