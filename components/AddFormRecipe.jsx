import { View, Text, StyleSheet } from 'react-native';
import Constants from 'expo-constants';
import React, { useState } from 'react';
import { TextInput } from 'react-native-gesture-handler';
import RNPickerSelect from 'react-native-picker-select';
const options = [
  { label: 'Opción 1', value: '1' },
  { label: 'Opción 2', value: '2' },
  { label: 'Opción 3', value: '3' }
];
const AddFormRecipe = () => {
  const [selectedValue, setSelectedValue] = useState('');
  const handleValueChange = (value) => {
    setSelectedValue(value);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.text_title}>Añade una receta</Text>
      <View style={styles.form_container}>
        <TextInput
          style={styles.input}
          placeholder='Nombre'
        />
        <RNPickerSelect
          style={styles.input_select}
          onValueChange={(value) => setSelectedValue(value)}
          items={[
            { label: 'Pescado', value: 'pescado' },
            { label: 'Carne', value: 'carne' }
          ]}
          placeholder={{
            label: 'Selecciona una opción...',
            value: null
          }}
          value={selectedValue}
          useNativeAndroidPickerStyle={false}
        />
        <TextInput
          style={styles.input}
          placeholder='Tiempo'
          keyboardType='numeric'
        />
        <TextInput
          style={styles.input}
          placeholder='Imagen'
        />
        <TextInput
          style={styles.input}
          placeholder='Personas'
          keyboardType='numeric'
        />
        <TextInput
          style={[styles.input, styles.height_input]}
          placeholder='Ingredientes'
        />
        <TextInput
          style={[styles.input, styles.height_input]}
          placeholder='Preparación'
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',

    marginTop: Constants.statusBarHeight,
    flexGrow: 1
  },
  text_title: {
    textShadowColor: 'black',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 1,
    color: '#884A39',
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 40
  },
  form_container: {
    flex: 1,
    marginTop: 50,
    gap: 10,
    alignItems: 'center'
  },
  input: {
    paddingHorizontal: 5,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#884A39',
    borderRadius: 4,
    width: '90%',
    height: 40
  },
  input_select: {
    paddingHorizontal: 5,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#884A39',
    borderRadius: 4,
    width: '90%',
    height: 40
  }
});

export default AddFormRecipe;
