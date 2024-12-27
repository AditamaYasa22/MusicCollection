import React, { useState, useRef } from 'react';
import {
  View,
  TextInput,
  Alert,
  StyleSheet,
  Animated,
  Text,
  Pressable,
} from 'react-native';
import { createMusicSQLite, initDB } from '../database/sqlite';
import { createMusic } from '../api/api';
import { useNavigation } from '@react-navigation/native';
import { Music } from '../types/music';
import * as Animatable from 'react-native-animatable';

const AddMusicScreen = () => {
  const [title, setTitle] = useState('');
  const [artist, setArtist] = useState('');
  const [genre, setGenre] = useState('');
  const [releaseYear, setReleaseYear] = useState<number | null>(null);
  const navigation = useNavigation();

  // Ref untuk animasi
  const titleRef = useRef<Animatable.View & { shake?: (duration?: number) => Promise<{ finished: boolean }> }>(null);
  const artistRef = useRef<Animatable.View & { shake?: (duration?: number) => Promise<{ finished: boolean }> }>(null);
  const genreRef = useRef<Animatable.View & { shake?: (duration?: number) => Promise<{ finished: boolean }> }>(null);
  const yearRef = useRef<Animatable.View & { shake?: (duration?: number) => Promise<{ finished: boolean }> }>(null);

  const buttonScale = useRef(new Animated.Value(1)).current;

  const handleAddMusic = async () => {
    if (!title || !artist || !genre || releaseYear === null) {
      Alert.alert('Error', 'All fields are required');

      // Pengecekan dan animasi shake untuk setiap input kosong
      if (!title && titleRef.current?.shake) titleRef.current.shake(800);
      if (!artist && artistRef.current?.shake) artistRef.current.shake(800);
      if (!genre && genreRef.current?.shake) genreRef.current.shake(800);
      if (releaseYear === null && yearRef.current?.shake) yearRef.current.shake(800);

      return;
    }

    const newMusic: Omit<Music, 'id'> = {
      title,
      artist,
      genre,
      releaseYear,
    };

    try {
      await initDB();
      await createMusicSQLite(newMusic);
      await createMusic(newMusic);
      Alert.alert('Success', 'Music added successfully');
      navigation.goBack();
    } catch (error) {
      console.error('Error adding music', error);
      Alert.alert('Error', 'Failed to add music');
    }
  };

  const handleButtonPressIn = () => {
    Animated.spring(buttonScale, {
      toValue: 0.9,
      useNativeDriver: true,
    }).start();
  };

  const handleButtonPressOut = () => {
    Animated.spring(buttonScale, {
      toValue: 1,
      useNativeDriver: true,
    }).start();
  };

  return (
    <Animatable.View
      animation="fadeInUp"
      duration={800}
      style={styles.container}
    >
      <Animatable.View ref={titleRef} animation="fadeIn" delay={200}>
        <TextInput
          style={styles.input}
          placeholder="Title"
          value={title}
          onChangeText={setTitle}
        />
      </Animatable.View>

      <Animatable.View ref={artistRef} animation="fadeIn" delay={400}>
        <TextInput
          style={styles.input}
          placeholder="Artist"
          value={artist}
          onChangeText={setArtist}
        />
      </Animatable.View>

      <Animatable.View ref={genreRef} animation="fadeIn" delay={600}>
        <TextInput
          style={styles.input}
          placeholder="Genre"
          value={genre}
          onChangeText={setGenre}
        />
      </Animatable.View>

      <Animatable.View ref={yearRef} animation="fadeIn" delay={800}>
        <TextInput
          style={styles.input}
          placeholder="Release Year"
          value={releaseYear !== null ? releaseYear.toString() : ''}
          keyboardType="numeric"
          onChangeText={(text) =>
            setReleaseYear(text ? parseInt(text, 10) : null)
          }
        />
      </Animatable.View>

      <Animated.View
        style={[
          styles.buttonContainer,
          { transform: [{ scale: buttonScale }] },
        ]}
      >
        <Pressable
          onPress={handleAddMusic}
          onPressIn={handleButtonPressIn}
          onPressOut={handleButtonPressOut}
          style={styles.button}
        >
          <Text style={styles.buttonText}>Add Music</Text>
        </Pressable>
      </Animated.View>
    </Animatable.View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f9f9f9',
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 15,
    paddingLeft: 8,
    borderRadius: 5,
    backgroundColor: '#fff',
  },
  buttonContainer: {
    marginTop: 20,
    borderRadius: 5,
    overflow: 'hidden',
  },
  button: {
    backgroundColor: '#007BFF',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default AddMusicScreen;
