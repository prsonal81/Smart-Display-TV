import { initializeApp } from 'firebase/app';
import { initializeFirestore } from 'firebase/firestore';

// ⚠️ IMPORTANTE: reemplaza estos valores con los que copiaste desde
// Firebase Console (Configuración del proyecto > Tus apps > SDK setup).
// No pasa nada si estos valores quedan visibles en tu código: a
// diferencia de una contraseña, este objeto está pensado para ir
// dentro de apps públicas. La seguridad real la dan las "reglas" de
// Firestore, no el secreto de esta configuración.
const firebaseConfig = {
  apiKey: 'AIzaSyC76rBWwSL02OodtYpc4QtkcnDXMI1F-w4',
  authDomain: 'michecadorexpo.firebaseapp.com',
  projectId: 'michecadorexpo',
  storageBucket: 'michecadorexpo.firebasestorage.app',
  messagingSenderId: '661574289106',
  appId: '1:661574289106:web:7b5b3f7ca0932101de8f0b',
};  
const app = initializeApp(firebaseConfig);
export const db = initializeFirestore(app, {
  experimentalForceLongPolling: true,
});