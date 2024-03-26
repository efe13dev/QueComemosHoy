import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import RNPickerSelect from 'react-native-picker-select';

const WeekDayPicker = ({ day, handleChange, recipesName }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.text_name}>{day}</Text>
      <RNPickerSelect
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
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    justifyContent: 'space-between',
    width: '100%',
    paddingHorizontal: 15
  },
  text_name: {
    marginLeft: 10
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
    paddingRight: 30
  }
});

export default WeekDayPicker;
