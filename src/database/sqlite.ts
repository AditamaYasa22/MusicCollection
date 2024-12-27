import SQLite from 'react-native-sqlite-storage';
import { Music } from '../types/music';

// Inisialisasi database
SQLite.enablePromise(true);

let db: SQLite.SQLiteDatabase | null = null;

// Fungsi untuk membuka database
export const initDB = async (): Promise<void> => {
  try {
    db = await SQLite.openDatabase({
      name: 'musik.db',
      location: 'default',
    });

    if (!db) throw new Error('Failed to open database');


    // Buat tabel jika belum ada
    await db.transaction(tx => {
      tx.executeSql(
        `CREATE TABLE IF NOT EXISTS Music (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          title TEXT,
          artist TEXT,
          genre TEXT,
          releaseYear INTEGER
        );`,
        [],
        () => console.log('Table created successfully'),
        (_, error) => {
          console.error('Error creating table:', error);
          return false;
        },
      );
    });
    console.log('Database initialized successfully');
  } catch (error) {
    console.error('Error initializing database:', error);
    throw error;
  }
};


// Fungsi untuk menambahkan data musik
export const createMusicSQLite = async (data: Omit<Music, 'id'>) => {
  if (!db) throw new Error('Database not initialized');

  await db.transaction(tx => {
    tx.executeSql(
      `INSERT INTO Music (title, artist, genre, releaseYear) VALUES (?, ?, ?, ?)`,
      [ data.title, data.artist, data.genre, data.releaseYear],
      (_, result) => {
        console.log('Insert success. Generated ID:', result.insertId); // Log ID yang dihasilkan
      },
      (_, error) => {
        console.error('Error adding music:', error);
        return false;
      },
    );
  });
};

// Fungsi untuk mendapatkan semua data musik
export const getMusicsSQLite = async (): Promise<Music[]> => {
  if (!db) throw new Error('Database not initialized');

  return new Promise((resolve, reject) => {
    db!.transaction(tx => {
      tx.executeSql(
        `SELECT * FROM Music`,
        [],
        (_, result) => {
          const rows = result.rows.raw() as Music[];
          resolve(rows);
        },
        (_, error) => {
          console.error('Error fetching musics:', error);
          reject(error);
          return false;
        },
      );
    });
  });
};

// Fungsi untuk mendapatkan data musik berdasarkan ID
export const getMusicByIdSQLite = async (id: number): Promise<Music | null> => {
  if (!db) throw new Error('Database not initialized');

  return new Promise((resolve, reject) => {
    db!.transaction(tx => {
      tx.executeSql(
        `SELECT * FROM Music WHERE id = ?`,
        [id],
        (_, result) => {
          const rows = result.rows.raw() as Music[];
          console.log('Fetched by ID:', rows);
          resolve(rows.length > 0 ? rows[0] : null);
        },
        (_, error) => {
          console.error('Error fetching music by ID:', error);
          reject(error);
          return false;
        },
      );
    });
  });
};

// Fungsi untuk memperbarui data musik
export const updateMusicSQLite = async (id: number, data: Partial<Music>): Promise<void> => {
  if (!db) throw new Error('Database not initialized');

  const fields = Object.keys(data)
    .map(key => `${key} = ?`)
    .join(', ');
  const values = Object.values(data);

  await db.transaction(tx => {
    tx.executeSql(
      `UPDATE Music SET ${fields} WHERE id = ?`,
      [...values, id],
      () => console.log('Music updated successfully'),
      (_, error) => {
        console.error('Error updating music:', error);
        return false;
      },
    );
  });
};

// Fungsi untuk menghapus data musik
export const deleteMusicSQLite = async (id: number): Promise<void> => {
  if (!db) throw new Error('Database not initialized');

  await db.transaction(tx => {
    tx.executeSql(
      `DELETE FROM Music WHERE id = ?`,
      [id],
      () => console.log('Music deleted successfully'),
      (_, error) => {
        console.error('Error deleting music:', error);
        return false;
      },
    );
  });
};
