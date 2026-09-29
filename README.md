# Smart Display App

App de React Native (Expo) para pantalla inteligente + checador +
panel de administrador. **Ahora sincronizada en tiempo real con
Firebase (Firestore)** — funciona entre celulares distintos.

## Cómo probar con 2 celulares

1. Celular A: modo **Empleado** → escribe tu nombre → "Marcar
   Entrada".
2. Celular B: modo **Pantalla** — la checada debería aparecer casi al
   instante, sin tocar nada.
3. Desde cualquier celular en modo **Administrador**, publica un
   aviso — debería aparecer también en el celular B (Pantalla) casi
   de inmediato.

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


