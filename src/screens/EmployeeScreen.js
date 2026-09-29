import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import RoleBadge from '../components/RoleBadge';
import {
  getEmployeeName,
  saveEmployeeName,
  addRecord,
  subscribeToRecords,
  subscribeToLastRecordForName,
} from '../utils/dataStore';

export default function EmployeeScreen({ onChangeRole }) {
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState(null);
  const [inputName, setInputName] = useState('');
  const [lastType, setLastType] = useState(null);
  const [myRecords, setMyRecords] = useState([]);

  // Cargar el nombre guardado (esto sigue siendo local, es identidad
  // de este celular, no algo que la nube necesite saber)
  useEffect(() => {
    (async () => {
      const savedName = await getEmployeeName();
      setName(savedName);
      setLoading(false);
    })();
  }, []);

  // En cuanto tenemos nombre, nos suscribimos a Firestore para saber
  // en tiempo real si este empleado está "dentro" o "fuera", y su
  // historial reciente.
  useEffect(() => {
    if (!name) return undefined;

    const unsubLast = subscribeToLastRecordForName(name, setLastType);
    const unsubAll = subscribeToRecords((all) => {
      setMyRecords(all.filter((r) => r.name === name).slice(0, 10));
    }, 50);

    return () => {
      unsubLast();
      unsubAll();
    };
  }, [name]);

  const handleRegister = async () => {
    const trimmed = inputName.trim();
    if (!trimmed) return;
    await saveEmployeeName(trimmed);
    setName(trimmed);
  };

  const handleCheck = async (type) => {
    await addRecord(name, type);
    // No hace falta recargar nada manualmente: la suscripción de
    // arriba va a recibir el cambio automáticamente.
  };

  if (loading) return null;

  if (!name) {
    return (
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <RoleBadge label="👤 Modo Empleado" onLongPress={onChangeRole} />
        <Text style={styles.title}>¿Cómo te llamas?</Text>
        <Text style={styles.subtitle}>Solo se pide una vez</Text>
        <TextInput
          style={styles.input}
          placeholder="Tu nombre"
          placeholderTextColor="#666"
          value={inputName}
          onChangeText={setInputName}
          autoFocus
        />
        <TouchableOpacity style={styles.saveButton} onPress={handleRegister}>
          <Text style={styles.saveButtonText}>Guardar</Text>
        </TouchableOpacity>
      </KeyboardAvoidingView>
    );
  }

  const canCheckIn = lastType !== 'entrada';
  const canCheckOut = lastType === 'entrada';

  return (
    <View style={styles.container}>
      <RoleBadge label="👤 Modo Empleado" onLongPress={onChangeRole} />
      <Text style={styles.greeting}>Hola, {name}</Text>
      <Text style={styles.status}>
        {lastType === 'entrada'
          ? '🟢 Actualmente: dentro'
          : '🔴 Actualmente: fuera'}
      </Text>

      <TouchableOpacity
        style={[styles.checkButton, styles.checkIn, !canCheckIn && styles.disabled]}
        disabled={!canCheckIn}
        onPress={() => handleCheck('entrada')}
      >
        <Text style={styles.checkButtonText}>Marcar Entrada</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.checkButton, styles.checkOut, !canCheckOut && styles.disabled]}
        disabled={!canCheckOut}
        onPress={() => handleCheck('salida')}
      >
        <Text style={styles.checkButtonText}>Marcar Salida</Text>
      </TouchableOpacity>

      <Text style={styles.historyTitle}>Tus últimas checadas</Text>
      <FlatList
        style={styles.historyList}
        data={myRecords}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <Text style={styles.historyItem}>
            {item.type === 'entrada' ? '🟢 Entrada' : '🔴 Salida'} —{' '}
            {item.clientTime
              ? new Date(item.clientTime).toLocaleTimeString()
              : ''}
          </Text>
        )}
        ListEmptyComponent={
          <Text style={styles.historyEmpty}>Sin checadas todavía</Text>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f1115',
    alignItems: 'center',
    paddingTop: 110,
    paddingHorizontal: 24,
    width: '100%',
  },
  title: { fontSize: 20, fontWeight: '700', color: '#fff', marginBottom: 4 },
  subtitle: { fontSize: 12, color: '#a0a4ab', marginBottom: 24 },
  input: {
    width: '100%',
    maxWidth: 320,
    backgroundColor: '#1c1f26',
    color: '#fff',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 16,
    fontSize: 16,
    marginBottom: 16,
  },
  saveButton: {
    backgroundColor: '#4f8cff',
    paddingVertical: 12,
    paddingHorizontal: 40,
    borderRadius: 24,
  },
  saveButtonText: { color: '#fff', fontWeight: '700', fontSize: 15 },
  greeting: { fontSize: 22, fontWeight: '700', color: '#fff', marginBottom: 4 },
  status: { fontSize: 14, color: '#a0a4ab', marginBottom: 24 },
  checkButton: {
    width: '100%',
    maxWidth: 320,
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: 'center',
    marginBottom: 12,
  },
  checkIn: { backgroundColor: '#2ecc71' },
  checkOut: { backgroundColor: '#ff6b6b' },
  disabled: { opacity: 0.3 },
  checkButtonText: { color: '#0f1115', fontWeight: '800', fontSize: 16 },
  historyTitle: {
    color: '#a0a4ab',
    fontSize: 13,
    marginTop: 20,
    marginBottom: 8,
    alignSelf: 'flex-start',
  },
  historyList: { width: '100%', maxWidth: 320 },
  historyItem: { color: '#ccc', fontSize: 13, paddingVertical: 4 },
  historyEmpty: { color: '#555', fontSize: 12 },
});
