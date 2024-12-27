import { getMusicsSQLite, createMusicSQLite, updateMusicSQLite, deleteMusicSQLite, getMusicByIdSQLite } from '../database/sqlite';
import { getMusics, createMusic, updateMusic, deleteMusic, getMusicById } from '../api/api';
import { Music } from '../types/music';

export const DataHandler = {
  async getMusics(dataSource: string): Promise<Music[]> {
    if (dataSource === 'mockApi') {
      return getMusics();
    } else {
      return getMusicsSQLite();
    }
  },

  async createMusic(dataSource: string, music: Music): Promise<void> {
    if (dataSource === 'mockApi') {
      await createMusic(music);
    } else {
      await createMusicSQLite(music);
    }
  },

  async updateMusic(dataSource: string, id: number, music: Partial<Music>): Promise<void> {
    if (dataSource === 'mockApi') {
      await updateMusic(id, music);
    } else {
      await updateMusicSQLite(id, music);
    }
  },

  async deleteMusic(dataSource: string, id: number): Promise<void> {
    if (dataSource === 'mockApi') {
      await deleteMusic(id);
    } else {
      await deleteMusicSQLite(id);
    }
  },

  async getMusicById(dataSource: string, id: number): Promise<Music | null> {
    if (dataSource === 'mockApi') {
      // Call your API function for fetching music by ID
      return await getMusicById(id);
    } else {
      return getMusicByIdSQLite(id);
    }
  },
};
