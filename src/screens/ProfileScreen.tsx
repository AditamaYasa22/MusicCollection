import React from 'react';
import { View, Text, StyleSheet, Image, Button } from 'react-native';
import { useDataSource } from "../context/DataSourceContext";

const ProfileScreen = () => {
  const { dataSource, setDataSource } = useDataSource();
  return (
    <View style={styles.container}>
      <Image
        source={require('../assets/MikeWazowski.png')} 
        style={styles.image}
      />
      <Text style={styles.name}>Aditama Yasa</Text>
      <Text style={styles.email}>aditama.yasa_ti22@nusaputra.ac.id</Text>
      <Text style={styles.description}>
        A passionate music collector and enthusiast who loves exploring different genres and artists.
      </Text>
      <Button title= "Switch to Mock API" onPress={() => setDataSource('mockApi')} />
        <Button title= "Switch to SQlite" onPress={() => setDataSource('sqlite')} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 20 },
  image: { width: 150, height: 150, borderRadius: 75, marginBottom: 20 },
  name: { fontSize: 24, fontWeight: 'bold', marginBottom: 5 },
  email: { fontSize: 16, color: 'gray', marginBottom: 20 },
  description: { textAlign: 'center', fontSize: 14, color: 'gray' },
  title: {fontSize: 24, fontWeight: 'bold', marginBottom: 16},
});

export default ProfileScreen;
