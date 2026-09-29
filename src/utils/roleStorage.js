import AsyncStorage from '@react-native-async-storage/async-storage';

const ROLE_KEY = 'device_role_v1';

// Los 3 modos posibles. Los usamos como constantes para no tener
// errores de dedo escribiendo el texto en varios archivos.
export const ROLES = {
  DISPLAY: 'display',
  EMPLOYEE: 'employee',
  ADMIN: 'admin',
};

export async function getSavedRole() {
  return await AsyncStorage.getItem(ROLE_KEY);
}

export async function saveRole(role) {
  await AsyncStorage.setItem(ROLE_KEY, role);
}

export async function clearRole() {
  await AsyncStorage.removeItem(ROLE_KEY);
}
