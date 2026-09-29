import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import RoleBadge from '../components/RoleBadge';
import {
  saveAdminMessage,
  subscribeToAdminMessage,
  subscribeToRecords,
} from '../utils/dataStore';

export default function AdminScreen({ onChangeRole }) {
  const [messageInput, setMessageInput] = useState('');
  const [records, setRecords] = useState([]);

  useEffect(() => {
    const unsubMessage = subscribeToAdminMessage(setMessageInput);
    const unsubRecords = subscribeToRecords(setRecords, 15);
    return () => {
      unsubMessage();
      unsubRecords();
    };
  }, []);

  const handlePublish = async () => {
    await saveAdminMessage(messageInput.trim());
    Alert.alert('Listo', 'Mensaje publicado en la pantalla');
  };

  const handleClear = async () => {
    await saveAdminMessage('');
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <RoleBadge label="🔧 Modo Administrador" onLongPress={onChangeRole} />

      <Text style={styles.title}>Mensaje para la pantalla</Text>
      <TextInput
        style={styles.input}
        placeholder="Escribe un aviso..."
        placeholderTextColor="#666"
        value={messageInput}
        onChangeText={setMessageInput}
        multiline
      />
      <View style={styles.row}>
        <TouchableOpacity style={styles.publishButton} onPress={handlePublish}>
          <Text style={styles.buttonText}>Publicar</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.clearButton} onPress={handleClear}>
          <Text style={styles.buttonText}>Borrar</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.sectionTitle}>Checadas recientes</Text>
      <FlatList
        style={styles.list}
        data={records}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <Text style={styles.recordItem}>
            {item.name} — {item.type === 'entrada' ? 'Entrada' : 'Salida'} —{' '}
            {item.clientTime ? new Date(item.clientTime).toLocaleString() : ''}
          </Text>
        )}
        ListEmptyComponent={
          <Text style={styles.empty}>Sin checadas todavía</Text>
        }
      />
    </KeyboardAvoidingView>
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
  title: { fontSize: 18, fontWeight: '700', color: '#fff', marginBottom: 12 },
  input: {
    width: '100%',
    maxWidth: 360,
    minHeight: 80,
    backgroundColor: '#1c1f26',
    color: '#fff',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 16,
    fontSize: 15,
    marginBottom: 12,
    textAlignVertical: 'top',
  },
  row: { flexDirection: 'row', gap: 12, marginBottom: 28 },
  publishButton: {
    backgroundColor: '#4f8cff',
    paddingVertical: 12,
    paddingHorizontal: 28,
    borderRadius: 20,
  },
  clearButton: {
    backgroundColor: '#2a2e37',
    paddingVertical: 12,
    paddingHorizontal: 28,
    borderRadius: 20,
  },
  buttonText: { color: '#fff', fontWeight: '700', fontSize: 14 },
  sectionTitle: {
    color: '#a0a4ab',
    fontSize: 13,
    marginBottom: 10,
    alignSelf: 'flex-start',
    maxWidth: 360,
    width: '100%',
  },
  list: { width: '100%', maxWidth: 360 },
  recordItem: { color: '#ccc', fontSize: 13, paddingVertical: 4 },
  empty: { color: '#555', fontSize: 12 },
});
