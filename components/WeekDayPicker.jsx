import React, { useCallback } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import RNPickerSelect from 'react-native-picker-select';

const WeekDayPicker = ({ day, handleChange, recipesName, selectedRecipe }) => {
  const capitalizedDay = day.charAt(0).toUpperCase() + day.slice(1);

  const handleValueChange = useCallback((value) => handleChange(day, value), [day, handleChange]);

  return (
    <View style={styles.container}>
      <View style={styles.rowContainer}>
        <View style={styles.dayContainer}>
          <Text style={styles.dayText}>{capitalizedDay}</Text>
        </View>
        <View style={styles.pickerContainer}>
          <RNPickerSelect
            value={selectedRecipe}
            style={{
              ...pickerSelectStyles,
              viewContainer: {
                width: '100%',
              },
              inputIOS: {
                ...pickerSelectStyles.inputIOS,
                width: '100%',
              },
              inputAndroid: {
                ...pickerSelectStyles.inputAndroid,
                width: '100%',
              },
            }}
            placeholder={{ label: 'Selecciona una receta...', value: null }}
            onValueChange={handleValueChange}
            items={recipesName}
            useNativeAndroidPickerStyle={false}
            textInputProps={{
              numberOfLines: 1,
              ellipsizeMode: 'tail',
            }}
          />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 6,
    paddingHorizontal: 6,
    paddingVertical: 6,
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    shadowColor: '#8B4513',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#FFE4B5',
    height: 60,
  },
  rowContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    height: '100%',
  },
  dayContainer: {
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    minWidth: 95,
    marginRight: 6,
    backgroundColor: '#FFF5E6',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#FFE4B5',
  },
  dayText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#663300',
    textShadowColor: 'rgba(102, 51, 0, 0.1)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 1,
    textAlign: 'center',
  },
  pickerContainer: {
    flex: 1,
    height: '100%',

    justifyContent: 'flex-start',
  },
});

const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
    fontSize: 15,
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: '#FFE4B5',
    borderRadius: 8,
    color: '#663300',
    backgroundColor: '#FFFFFF',
    paddingRight: 30,
    textAlign: 'left',
    height: '100%',
  },
  inputAndroid: {
    fontSize: 15,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: '#FFE4B5',
    borderRadius: 8,
    color: '#663300',
    backgroundColor: '#FFFFFF',
    paddingRight: 30,
    textAlign: 'left',
    height: '100%',
  },
  iconContainer: {
    top: 8,
    right: 12,
  },
  placeholder: {
    color: '#663300',
    opacity: 0.6,
    fontSize: 14,
    fontStyle: 'italic',
    textAlign: 'left',
  },
});

export default WeekDayPicker;
