import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  Button,
  StyleSheet,
  ActivityIndicator,
  useWindowDimensions,
} from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import * as Animatable from 'react-native-animatable'; // Import Animatable
import { RootStackParamList } from '../navigation/types';
import { useDataSource } from '../context/DataSourceContext'; // Abstraksi data
import { getMusicsSQLite } from '../database/sqlite';
import { Music } from '../types/music';

type HomeScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'MusicCollection'
>;

const HomeScreen = () => {
  const [musics, setMusics] = useState<Music[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const navigation = useNavigation<HomeScreenNavigationProp>();
  const { width, height } = useWindowDimensions();
  const isLandscape = width > height;

  const { isDBInitialized } = useDataSource(); // Mengambil fungsi dari data service

  const fetchMusics = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await getMusicsSQLite();
      console.log('Fetched musics:', response); // Menggunakan abstraksi data service
      setMusics(response);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch music list.');
      console.error('Error fetching musics:', err);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      console.log('isDBInitialized:', isDBInitialized);
      if (isDBInitialized) {
        fetchMusics();
      }
    }, [isDBInitialized])
  );

  // Animasi untuk item musik
  const renderMusicItem = ({ item, index }: { item: Music; index: number }) => (
    <Animatable.View
      style={styles.item}
      animation="fadeInUp" // Animasi bergerak dari bawah ke atas
      duration={500}       // Durasi animasi
      delay={index * 100}  // Delay untuk staggered animation
    >
      <Text style={styles.title}>{item.title}</Text>
      <Text>
        {item.artist} - {item.genre} ({item.releaseYear})
      </Text>
      <Button
        title="Go To Details Music"
        onPress={() => {
          if (item.id) {
            console.log('Navigating with ID:', item.id); // Log sebelum navigasi
            navigation.navigate('DetailMusic', { id: item.id });
          } else {
            console.error('Error: ID is null'); // Tambahkan log jika ID null
          }
        }}
      />
    </Animatable.View>
  );

  // Animasi untuk layar belum siap
  if (!isDBInitialized) {
    return (
      <Animatable.View
        animation="zoomIn"
        duration={800}
        style={styles.center}
      >
        <ActivityIndicator size="large" color="#0000ff" />
        <Text>Initializing database...</Text>
      </Animatable.View>
    );
  }

  // Animasi untuk layar pemuatan
  if (loading) {
    return (
      <Animatable.View
        animation="fadeIn"
        duration={800}
        style={styles.center}
      >
        <ActivityIndicator size="large" color="#0000ff" />
        <Text>Loading music list...</Text>
      </Animatable.View>
    );
  }

  // Animasi untuk error
  if (error) {
    return (
      <Animatable.View
        animation="shake" // Animasi error shake
        duration={500}
        style={styles.center}
      >
        <Text style={styles.error}>{error}</Text>
        <Button title="Retry" onPress={fetchMusics} />
      </Animatable.View>
    );
  }

  return (
    <Animatable.View
      animation="fadeIn" // Animasi fade-in untuk layar utama
      duration={800}
      style={styles.container}
    >
      <View style={[styles.buttonWrapper, { marginBottom: isLandscape ? 20 : 10 }]}>
        <Button
          title="Add New Music"
          onPress={() => navigation.navigate('AddMusic')}
        />
      </View>
      <FlatList
        data={musics}
        contentContainerStyle={styles.listContent}
        keyExtractor={(item) =>
          item?.id ? item.id.toString() : Math.random().toString()
        }
        renderItem={renderMusicItem}
        ListEmptyComponent={<Text style={styles.empty}>No music available.</Text>}
      />
    </Animatable.View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  buttonWrapper: {
    alignSelf: 'center',
    width: '100%',
  },
  listContent: {
    flexGrow: 1,
    paddingTop: 10,
  },
  item: {
    marginBottom: 10,
    padding: 10,
    borderWidth: 1,
    borderRadius: 5,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  error: {
    color: 'red',
    textAlign: 'center',
    marginBottom: 10,
  },
  empty: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 16,
    color: '#999',
  },
});

export default HomeScreen;
