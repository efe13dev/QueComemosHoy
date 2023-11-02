import * as SecureStore from 'expo-secure-store';

export async function saveStorage (key, value) {
  try {
    await SecureStore.setItemAsync(key, value);
  } catch (error) {
    console.error(error);
  }
}

export async function removeStorage () {
  try {
    const value = await SecureStore.getItemAsync('weekStore');
    if (value !== null) {
      await SecureStore.deleteItemAsync('weekStore');
      console.log('La clave "weekStore" ha sido eliminada del almacenamiento.');
    } else {
      console.log('La clave "weekStore" no existe en el almacenamiento.');
    }
  } catch (error) {
    console.log(
      'Error al eliminar la clave "weekStore" del almacenamiento:',
      error
    );
  }
}
export async function getStorage (key) {
  const result = await SecureStore.getItemAsync(key);
  if (result) {
    console.log("🔐 Here's your value 🔐 \n" + result);
  } else {
    console.log('No values stored under that key.');
  }
  if (typeof result === 'string') {
    const parsedData = JSON.parse(result);
    return parsedData;
  } else {
    console.log('El valor obtenido no es un string válido en formato JSON.');
  }
  return null;
}
