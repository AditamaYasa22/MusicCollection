import React, { useCallback, useState } from 'react';
import { View, Text, Button, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import { useNavigation, useRoute, useFocusEffect } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Music } from '../types/music';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../navigation/types';
import { useDataService } from '../services/DataServices'; // Menggunakan abstraksi data
import { getMusicByIdSQLite, deleteMusicSQLite } from '../database/sqlite';
import * as Animatable from 'react-native-animatable';

type DetailMusicScreenRouteProp = RouteProp<RootStackParamList, 'DetailMusic'>;
type DetailMusicScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'DetailMusic'
>;

const DetailMusic = () => {
  const [music, setMusic] = useState<Music | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const route = useRoute<DetailMusicScreenRouteProp>();
  const navigation = useNavigation<DetailMusicScreenNavigationProp>();
  const { id } = route.params;

  const { getMusicById, removeMusic } = useDataService(); // Abstraksi sumber data

  useFocusEffect(
    useCallback(() => {
      fetchMusicDetail();
    }, [])
  );

  const fetchMusicDetail = async () => {
    setLoading(true);
    setError(null);
    try {
      const musicData = await getMusicByIdSQLite(Number(id)); // Mengambil data dari data service
      setMusic(musicData);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch music details');
      console.error('Error fetching music detail:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    Alert.alert(
      'Confirm Delete',
      'Are you sure you want to delete this music?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteMusicSQLite(Number(id)); // Menghapus data melalui data service
              Alert.alert('Success', 'Music deleted successfully');
              navigation.goBack();
            } catch (err: any) {
              Alert.alert('Error', err.message || 'Failed to delete music');
              console.error('Error deleting music:', err);
            }
          },
        },
      ],
      { cancelable: true }
    );
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text>Loading...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.center}>
        <Text style={styles.error}>{error}</Text>
        <Button title="Retry" onPress={fetchMusicDetail} />
      </View>
    );
  }

  return (
    <Animatable.View
      animation="fadeInUp"
      duration={800}
      style={styles.container}
    >
      {music ? (
        <>
          <Animatable.Text
            style={styles.title}
            animation="fadeInDown"
            delay={200}
            duration={600}
          >
            {music?.title || 'Unknown Title'}
          </Animatable.Text>
          <Text>Artist: {music?.artist || 'Unknown Artist'}</Text>
          <Text>Genre: {music?.genre || 'Unknown Genre'}</Text>
          <Text>Release Year: {music?.releaseYear || 'N/A'}</Text>
          <View style={styles.buttons}>
            <Animatable.View
              animation="zoomIn"
              delay={500}
              duration={500}
              style={styles.buttonWrapper}
            >
              <Button
                title="Edit"
                onPress={() => navigation.navigate('EditMusic', { id: music.id })}
              />
            </Animatable.View>

            <Animatable.View
              animation="zoomIn"
              delay={700}
              duration={500}
              style={styles.buttonWrapper}
            >
              <Button title="Delete" onPress={handleDelete} color="red" />
            </Animatable.View>
          </View>
        </>
      ) : (
        <Text style={styles.error}>No data found for this music</Text>
      )}
    </Animatable.View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 10 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  error: { color: 'red', textAlign: 'center', marginBottom: 20 },
  buttons: { marginTop: 20 },
  buttonWrapper: {
    marginVertical: 10,
  },
});

export default DetailMusic;
