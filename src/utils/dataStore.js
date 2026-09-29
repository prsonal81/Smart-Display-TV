import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  collection,
  addDoc,
  onSnapshot,
  query,
  orderBy,
  limit,
  doc,
  setDoc,
  serverTimestamp,
} from 'firebase/firestore';
import { db } from '../firebase/config';

const EMPLOYEE_NAME_KEY = 'employee_name_v1';

/**
 * ¿Por qué el nombre del empleado NO va a Firestore?
 * Porque es un dato de "identidad de este celular" (como su
 * configuración), no un dato que otros dispositivos necesiten
 * consultar. Cada empleado solo necesita que SU PROPIO celular
 * recuerde su nombre.
 */
export async function getEmployeeName() {
  return await AsyncStorage.getItem(EMPLOYEE_NAME_KEY);
}
export async function saveEmployeeName(name) {
  await AsyncStorage.setItem(EMPLOYEE_NAME_KEY, name);
}

// --- Registros de entrada/salida: ahora viven en Firestore ---

const recordsRef = collection(db, 'records');

export async function addRecord(name, type) {
  await addDoc(recordsRef, {
    name,
    type, // 'entrada' | 'salida'
    // Usamos AMBOS: serverTimestamp (la hora real del servidor, más
    // confiable) y clientTime (un string ISO que sí está disponible
    // de inmediato, útil para ordenar sin esperar la confirmación
    // del servidor).
    timestamp: serverTimestamp(),
    clientTime: new Date().toISOString(),
  });
}

/**
 * Se suscribe a los últimos registros. onUpdate(records) se llama
 * automáticamente cada vez que hay un cambio en Firestore — esta es
 * la pieza que hace posible el "tiempo real" entre celulares
 * distintos, sin que nadie tenga que refrescar nada a mano.
 *
 * Devuelve una función para "desuscribirse" (cancelar la escucha),
 * que hay que llamar cuando el componente se desmonta.
 */
export function subscribeToRecords(onUpdate, max = 20) {
  const q = query(recordsRef, orderBy('clientTime', 'desc'), limit(max));
  return onSnapshot(q, (snapshot) => {
    const records = snapshot.docs.map((docSnap) => ({
      id: docSnap.id,
      ...docSnap.data(),
    }));
    onUpdate(records);
  });
}

/**
 * Se suscribe específicamente al último tipo de checada ('entrada' o
 * 'salida') de UN empleado en particular, para saber si mostrar el
 * botón de Entrada o el de Salida.
 */
export function subscribeToLastRecordForName(name, onUpdate) {
  const q = query(recordsRef, orderBy('clientTime', 'desc'), limit(50));
  return onSnapshot(q, (snapshot) => {
    const records = snapshot.docs.map((d) => d.data());
    const mine = records.find((r) => r.name === name);
    onUpdate(mine ? mine.type : null);
  });
}

// --- Mensaje del administrador: un solo documento en Firestore ---

const messageDocRef = doc(db, 'config', 'admin_message');

export async function saveAdminMessage(message) {
  await setDoc(messageDocRef, { text: message });
}

export function subscribeToAdminMessage(onUpdate) {
  return onSnapshot(messageDocRef, (docSnap) => {
    onUpdate(docSnap.exists() ? docSnap.data().text : '');
  });
}
