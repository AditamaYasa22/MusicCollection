import { useDataSource } from '../context/DataSourceContext';
import { getMusics, getMusicById as getMusicByIdApi, createMusic, updateMusic, deleteMusic } from '../api/api';
import {
  getMusicsSQLite,
  getMusicByIdSQLite,
  createMusicSQLite,
  updateMusicSQLite,
  deleteMusicSQLite,
} from '../database/sqlite';
import { Music } from '../types/music';

export const useDataService = () => {
  const { dataSource } = useDataSource();

  const getAllMusics = async (): Promise<Music[]> => {
    return dataSource === 'mockApi' ? await getMusics() : await getMusicsSQLite();
  };

  const getMusicById = async (id: number): Promise<Music | null> => {
    if (dataSource === 'mockApi') {
      return await getMusicByIdApi(id); // Mengambil musik berdasarkan ID dari Mock API
    } else {
      return await getMusicByIdSQLite(id); // Mengambil musik berdasarkan ID dari SQLite
    }
  };

  const addMusic = async (data: Music): Promise<void> => {
    if (dataSource === 'mockApi') {
      await createMusic(data);
    } else {
      await createMusicSQLite(data);
    }
  };

  const updateMusicData = async (id: number, data: Partial<Music>): Promise<void> => {
    if (dataSource === 'mockApi') {
      await updateMusic(id, data);
    } else {
      await updateMusicSQLite(id, data);
    }
  };

  const removeMusic = async (id: number): Promise<void> => {
    if (dataSource === 'mockApi') {
      await deleteMusic(id);
    } else {
      await deleteMusicSQLite(id);
    }
  };

  return {
    getAllMusics,
    getMusicById,
    addMusic,
    updateMusicData,
    removeMusic,
  };
};
