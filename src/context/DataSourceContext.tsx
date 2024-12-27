import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { initDB } from '../database/sqlite';

interface DataSourceContextProps {
  isDBInitialized: boolean;
  dataSource: any; // Definisikan tipe yang sesuai jika Anda tahu tipe data dari dataSource
}

const DataSourceContext = createContext<DataSourceContextProps | undefined>(undefined);

export const DataSourceProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isDBInitialized, setIsDBInitialized] = useState(false);
  const [dataSource, setDataSource] = useState<any>(null); // Inisialisasi dengan tipe dan nilai yang sesuai

  useEffect(() => {
    const initializeSQLite = async () => {
      try {
        const db = await initDB(); // Pastikan `initDB` mengembalikan data yang Anda butuhkan
        setDataSource(db);
        setIsDBInitialized(true);
      } catch (err) {
        console.error('Failed to initialize database:', err);
      }
    };

    initializeSQLite();
  }, []);

  return (
    <DataSourceContext.Provider value={{ isDBInitialized, dataSource }}>
      {children}
    </DataSourceContext.Provider>
  );
};

export const useDataSource = () => {
  const context = useContext(DataSourceContext);
  if (!context) {
    throw new Error('useDataSource must be used within a DataSourceProvider');
  }
  return context;
};
