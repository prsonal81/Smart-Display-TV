# Smart Display App

App de React Native (Expo) para pantalla inteligente + checador +
panel de administrador. **Ahora sincronizada en tiempo real con
Firebase (Firestore)** — funciona entre celulares distintos.

## Configuración necesaria (una sola vez)

1. En `src/firebase/config.js`, reemplaza el objeto `firebaseConfig`
   con el que copiaste de Firebase Console (Configuración del
   proyecto > Tus apps > SDK setup).
2. Instala el paquete de Firebase:
   ```bash
   npm install firebase
   ```

## Cómo probar con 2 celulares

1. Celular A: modo **Empleado** → escribe tu nombre → "Marcar
   Entrada".
2. Celular B: modo **Pantalla** — la checada debería aparecer casi al
   instante, sin tocar nada.
3. Desde cualquier celular en modo **Administrador**, publica un
   aviso — debería aparecer también en el celular B (Pantalla) casi
   de inmediato.

## Qué cambió respecto a la versión local

- Los registros de entrada/salida y el mensaje del administrador ya
  NO se guardan solo en el celular — viven en Firestore (la nube).
- Las pantallas ya no "refrescan cada 2 segundos": usan
  `onSnapshot` (suscripciones en tiempo real) de Firestore, así que
  se actualizan solas en cuanto hay un cambio, sin importar en qué
  celular haya ocurrido.
- El nombre del empleado sigue siendo local (es identidad de "este
  celular"), no necesita ir a la nube.

## Nota sobre seguridad (léela antes de mostrarlo en público)

Elegimos "modo de prueba" en Firestore para simplificar el
prototipo — eso significa que **cualquiera** con tu configuración
podría leer o escribir en tu base de datos, sin necesitar login. Está
bien para practicar y hacer una demo, pero:
- Esas reglas de prueba expiran automáticamente a los 30 días.
- Para un proyecto real habría que agregar Firebase Authentication y
  reglas de seguridad que solo permitan escribir a usuarios
  verificados.

## Cómo correrla

```bash
npm install
npx expo start --tunnel
```

## Estructura

```
SmartDisplayApp/
├── App.js
└── src/
    ├── components/
    │   └── RoleBadge.js
    ├── firebase/
    │   └── config.js               -> tu configuración de Firebase
    ├── screens/
    │   ├── RoleSelectionScreen.js
    │   ├── DisplayScreen.js        -> escucha Firestore en tiempo real
    │   ├── EmployeeScreen.js       -> nombre local + checadas en Firestore
    │   └── AdminScreen.js          -> publica mensaje en Firestore
    └── utils/
        ├── roleStorage.js          -> qué modo eligió este dispositivo
        └── dataStore.js            -> lectura/escritura en Firestore
```


