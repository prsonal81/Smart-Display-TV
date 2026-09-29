import React, { useState, useEffect, useCallback } from 'react';
import { StatusBar, ActivityIndicator, View } from 'react-native';
import {
  SafeAreaProvider,
  SafeAreaView,
} from 'react-native-safe-area-context';

import { ROLES, getSavedRole, clearRole } from './src/utils/roleStorage';
import RoleSelectionScreen from './src/screens/RoleSelectionScreen';
import DisplayScreen from './src/screens/DisplayScreen';
import EmployeeScreen from './src/screens/EmployeeScreen';
import AdminScreen from './src/screens/AdminScreen';

export default function App() {
  const [loading, setLoading] = useState(true);
  const [role, setRole] = useState(null);

  useEffect(() => {
    (async () => {
      const savedRole = await getSavedRole();
      setRole(savedRole);
      setLoading(false);
    })();
  }, []);

  const handleChangeRole = useCallback(async () => {
    await clearRole();
    setRole(null);
  }, []);

  const renderScreen = () => {
    if (!role) {
      return <RoleSelectionScreen onRoleSelected={setRole} />;
    }
    switch (role) {
      case ROLES.DISPLAY:
        return <DisplayScreen onChangeRole={handleChangeRole} />;
      case ROLES.EMPLOYEE:
        return <EmployeeScreen onChangeRole={handleChangeRole} />;
      case ROLES.ADMIN:
        return <AdminScreen onChangeRole={handleChangeRole} />;
      default:
        return <RoleSelectionScreen onRoleSelected={setRole} />;
    }
  };

  return (
    <SafeAreaProvider>
      <SafeAreaView style={{ flex: 1, backgroundColor: '#0f1115' }}>
        <StatusBar barStyle="light-content" />
        {loading ? (
          <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
            <ActivityIndicator color="#4f8cff" />
          </View>
        ) : (
          renderScreen()
        )}
      </SafeAreaView>
    </SafeAreaProvider>
  );
}
