import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../navigation/types';
import { useDataService } from '../services/DataServices'; // Menggunakan abstraksi data
import { Music } from '../types/music';
import { getMusicByIdSQLite, updateMusicSQLite } from '../database/sqlite';
import * as Animatable from 'react-native-animatable';

const EditMusicScreen = () => {
  const [title, setTitle] = useState('');
  const [artist, setArtist] = useState('');
  const [genre, setGenre] = useState('');
  const [releaseYear, setReleaseYear] = useState('');
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const route = useRoute<RouteProp<RootStackParamList, 'EditMusic'>>();
  const navigation = useNavigation();
  const { id } = route.params;

  const { getMusicById, updateMusicData } = useDataService(); // Fungsi abstraksi data

  useEffect(() => {
    fetchMusicData();
  }, []);

  const fetchMusicData = async () => {
    setLoading(true);
    setError(null);
    try {
      const music = await getMusicByIdSQLite(Number(id)); // Mengambil detail musik berdasarkan ID
      if (!music) {
        setError('Music Not Found.');
        return;
      }
      setTitle(music.title);
      setArtist(music.artist);
      setGenre(music.genre);
      setReleaseYear(music.releaseYear.toString());
    } catch (err: any) {
      setError('Failed to fetch music details. Please try again later.');
      console.error('Error fetching music data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async () => {
    if (!title || !artist || !genre || !releaseYear || isNaN(Number(releaseYear))) {
      Alert.alert('Validation Error', 'All fields are required, and Release Year must be a valid number.');
      return;
    }

    setUpdating(true);
    try {
      await updateMusicSQLite(id, {
        title,
        artist,
        genre,
        releaseYear: parseInt(releaseYear, 10),
      }); // Memperbarui data musik
      Alert.alert('Success', 'Music updated successfully.', [
        { text: 'OK', onPress: () => navigation.goBack() },
      ]);
    } catch (err: any) {
      Alert.alert('Error', 'Failed to update music. Please try again later.');
      console.error('Error updating music:', err);
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <Animatable.View
        animation="fadeIn"
        duration={800}
        style={styles.center}
      >
        <ActivityIndicator size="large" color="#0000ff" />
        <Text>Loading...</Text>
      </Animatable.View>
    );
  }

  if (error) {
    return (
      <Animatable.View
        animation="fadeIn"
        duration={800}
        style={styles.center}
      >
        <Text style={styles.error}>{error}</Text>
        <Button title="Retry" onPress={fetchMusicData} />
      </Animatable.View>
    );
  }

  return (
    <Animatable.View
      animation="fadeInUp"
      duration={800}
      style={styles.container}
    >
      <Animatable.Text
        style={styles.title}
        animation="fadeInDown"
        duration={600}
        delay={200}
      >
        Edit Music
      </Animatable.Text>
      <TextInput
        style={styles.input}
        placeholder="Title"
        value={title}
        onChangeText={setTitle}
      />
      <TextInput
        style={styles.input}
        placeholder="Artist"
        value={artist}
        onChangeText={setArtist}
      />
      <TextInput
        style={styles.input}
        placeholder="Genre"
        value={genre}
        onChangeText={setGenre}
      />
      <TextInput
        style={styles.input}
        placeholder="Release Year"
        value={releaseYear}
        keyboardType="numeric"
        onChangeText={setReleaseYear}
      />
      {updating ? (
        <ActivityIndicator size="small" color="#0000ff" />
      ) : (
        <Animatable.View
          animation="bounceIn"
          duration={600}
          delay={500}
        >
          <Button title="Update Music" onPress={handleUpdate} />
        </Animatable.View>
      )}
    </Animatable.View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 4,
    padding: 8,
    marginBottom: 16,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  error: {
    color: 'red',
    textAlign: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
});

export default EditMusicScreen;
