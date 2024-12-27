import axios from 'axios';
import { Music } from '../types/music';

const API = axios.create({
  baseURL: 'https://674f242ebb559617b26e328d.mockapi.io/musics',
  headers: { 'Content-Type': 'application/json' },
});

// Helper function untuk menangani error
const handleError = (error: any) => {
  if (error.response) {
    console.error(`API Error: ${error.response.status} - ${error.response.data}`);
    throw new Error(error.response.data.message || `Request failed with status ${error.response.status}`);
  } else if (error.request) {
    console.error('API Error: No response from server', error.request);
    throw new Error('No response from server. Please check your internet connection.');
  } else {
    console.error('API Error:', error.message);
    throw new Error(error.message || 'An unexpected error occurred.');
  }
};

export const getMusics = async (): Promise<Music[]> => {
  try {
    const response = await API.get<Music[]>('/');
    return response.data;
  } catch (error) {
    handleError(error);
    return []; 
  }
};

export const getMusicById = async (id: number): Promise<Music> => {
  try {
    const response = await API.get<Music>(`/${id}`);
    return response.data;
  } catch (error) {
    handleError(error);
    return {} as Music; 
  }
};

export const createMusic = async (data: Omit<Music, 'id'>): Promise<Music> => {
  try {
    const response = await API.post<Music>('/', data);
    return response.data;
  } catch (error) {
    handleError(error);
    return {} as Music; 
  }
};

export const updateMusic = async (id: number, data: Partial<Music>): Promise<Music> => {
  try {
    const response = await API.put<Music>(`/${id}`, data);
    return response.data;
  } catch (error) {
    handleError(error);
    return {} as Music; 
  }
};

export const deleteMusic = async (id: number): Promise<void> => {
  try {
    await API.delete<void>(`/${id}`);
  } catch (error) {
    handleError(error);
    return; 
  }
};
