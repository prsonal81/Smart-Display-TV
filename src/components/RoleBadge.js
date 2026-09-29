import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';

export default function RoleBadge({ label, onLongPress }) {
  return (
    <TouchableOpacity
      style={styles.badge}
      onLongPress={onLongPress}
      delayLongPress={1500}
    >
      <Text style={styles.text}>{label}</Text>
      <Text style={styles.hint}>(mantén presionado para cambiar de modo)</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  badge: {
    position: 'absolute',
    top: 50,
    alignItems: 'center',
  },
  text: { color: '#fff', fontSize: 16, fontWeight: '700' },
  hint: { color: '#555', fontSize: 10, marginTop: 4 },
});
