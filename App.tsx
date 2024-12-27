import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import BottomTabs from './src/navigation/BottomTabs';
import { DataSourceProvider } from './src/context/DataSourceContext';
import { initDB } from './src/database/sqlite';
import { ActivityIndicator, View } from 'react-native';

const App = () => {
  const [isDBInitialized, setIsDBInitialized] = useState(false);

  useEffect(() => {
    const initializeSQLite = async () => {
      try {
        await initDB();
        setIsDBInitialized(true); // Tandai inisialisasi selesai
      } catch (err) {
        console.error('Failed to initialize database:', err);
      }
    };

    initializeSQLite();
  }, []);

  if (!isDBInitialized) {
    // Tampilkan indikator loading saat database sedang diinisialisasi
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <DataSourceProvider>
      <NavigationContainer>
        <BottomTabs />
      </NavigationContainer>
    </DataSourceProvider>
  );
};

export default App;
