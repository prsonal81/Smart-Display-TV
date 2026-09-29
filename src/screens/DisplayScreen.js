import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import RoleBadge from '../components/RoleBadge';
import { subscribeToAdminMessage, subscribeToRecords } from '../utils/dataStore';

export default function DisplayScreen({ onChangeRole }) {
  const [message, setMessage] = useState('');
  const [records, setRecords] = useState([]);
  const [clock, setClock] = useState(new Date());

  useEffect(() => {
    // Estas dos líneas son la magia del tiempo real: en cuanto CUALQUIER
    // celular publique un mensaje o registre una checada en Firestore,
    // esta pantalla se entera y se redibuja sola, sin refrescar nada.
    const unsubMessage = subscribeToAdminMessage(setMessage);
    const unsubRecords = subscribeToRecords(setRecords, 8);
    const clockInterval = setInterval(() => setClock(new Date()), 1000);

    return () => {
      unsubMessage();
      unsubRecords();
      clearInterval(clockInterval);
    };
  }, []);

  return (
    <View style={styles.container}>
      <RoleBadge label="📺 Modo Pantalla" onLongPress={onChangeRole} />

      <Text style={styles.clock}>{clock.toLocaleTimeString()}</Text>
      <Text style={styles.date}>
        {clock.toLocaleDateString('es-MX', {
          weekday: 'long',
          day: 'numeric',
          month: 'long',
        })}
      </Text>

      {!!message && (
        <View style={styles.messageBanner}>
          <Text style={styles.messageText}>📢 {message}</Text>
        </View>
      )}

      <Text style={styles.sectionTitle}>Últimas checadas</Text>
      <FlatList
        style={styles.list}
        data={records}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.recordRow}>
            <Text style={styles.recordName}>{item.name}</Text>
            <Text
              style={
                item.type === 'entrada' ? styles.recordIn : styles.recordOut
              }
            >
              {item.type === 'entrada' ? 'Entrada' : 'Salida'}
            </Text>
            <Text style={styles.recordTime}>
              {item.clientTime
                ? new Date(item.clientTime).toLocaleTimeString()
                : ''}
            </Text>
          </View>
        )}
        ListEmptyComponent={
          <Text style={styles.empty}>Sin checadas todavía</Text>
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
  clock: { fontSize: 48, fontWeight: '800', color: '#fff' },
  date: {
    fontSize: 14,
    color: '#a0a4ab',
    marginBottom: 24,
    textTransform: 'capitalize',
  },
  messageBanner: {
    backgroundColor: '#4f8cff22',
    borderWidth: 1,
    borderColor: '#4f8cff55',
    borderRadius: 14,
    paddingVertical: 16,
    paddingHorizontal: 20,
    width: '100%',
    maxWidth: 420,
    marginBottom: 28,
  },
  messageText: { color: '#fff', fontSize: 16, textAlign: 'center' },
  sectionTitle: {
    color: '#a0a4ab',
    fontSize: 13,
    marginBottom: 10,
    alignSelf: 'flex-start',
    maxWidth: 420,
    width: '100%',
  },
  list: { width: '100%', maxWidth: 420 },
  recordRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#1c1f26',
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 14,
    marginBottom: 8,
  },
  recordName: { color: '#fff', fontSize: 14, flex: 1 },
  recordIn: { color: '#2ecc71', fontWeight: '700', fontSize: 13 },
  recordOut: { color: '#ff6b6b', fontWeight: '700', fontSize: 13 },
  recordTime: { color: '#a0a4ab', fontSize: 12, marginLeft: 12 },
  empty: { color: '#555', fontSize: 12 },
});
