import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { ROLES, saveRole } from '../utils/roleStorage';

export default function RoleSelectionScreen({ onRoleSelected }) {
  const handleSelect = async (role) => {
    await saveRole(role);
    onRoleSelected(role);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>¿Qué es este dispositivo?</Text>
      <Text style={styles.subtitle}>
        Esta elección se guarda — no se vuelve a preguntar
      </Text>

      <TouchableOpacity
        style={[styles.button, styles.displayButton]}
        onPress={() => handleSelect(ROLES.DISPLAY)}
      >
        <Text style={styles.icon}>📺</Text>
        <Text style={styles.buttonTitle}>Pantalla inteligente</Text>
        <Text style={styles.buttonSubtitle}>
          Muestra avisos y datos en tiempo real
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.button, styles.employeeButton]}
        onPress={() => handleSelect(ROLES.EMPLOYEE)}
      >
        <Text style={styles.icon}>👤</Text>
        <Text style={styles.buttonTitle}>Empleado (checador)</Text>
        <Text style={styles.buttonSubtitle}>
          Marca entrada/salida con huella o rostro
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.button, styles.adminButton]}
        onPress={() => handleSelect(ROLES.ADMIN)}
      >
        <Text style={styles.icon}>🔧</Text>
        <Text style={styles.buttonTitle}>Administrador</Text>
        <Text style={styles.buttonSubtitle}>
          Gestiona contenido y checadas
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f1115',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 6,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 13,
    color: '#a0a4ab',
    marginBottom: 32,
    textAlign: 'center',
  },
  button: {
    width: '100%',
    maxWidth: 360,
    backgroundColor: '#1c1f26',
    borderRadius: 16,
    paddingVertical: 20,
    paddingHorizontal: 20,
    marginBottom: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#2a2e37',
  },
  displayButton: { borderColor: '#4fd1ff33' },
  employeeButton: { borderColor: '#4f8cff33' },
  adminButton: { borderColor: '#ff6b6b33' },
  icon: { fontSize: 32, marginBottom: 8 },
  buttonTitle: { fontSize: 17, fontWeight: '700', color: '#fff' },
  buttonSubtitle: {
    fontSize: 12,
    color: '#a0a4ab',
    marginTop: 4,
    textAlign: 'center',
  },
});
