import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import DetailMusic from '../screens/DetailMusic';
import { getMusicById, deleteMusic } from '../api/api';
import { NavigationContainer } from '@react-navigation/native';
import { Alert } from 'react-native';

jest.spyOn(Alert, 'alert');

// Mock fungsi API
jest.mock('../api/api', () => ({
  getMusicById: jest.fn(),
  deleteMusic: jest.fn(),
}));

// Mock navigasi
const mockNavigate = jest.fn();
const mockGoBack = jest.fn();

jest.mock('@react-navigation/native', () => {
  const actualNav = jest.requireActual('@react-navigation/native');
  return {
    ...actualNav,
    useNavigation: () => ({
      navigate: mockNavigate,
      goBack: mockGoBack,
    }),
    useRoute: () => ({
      params: { id: '8' },
    }),
  };
});

describe('DetailMusic', () => {
  beforeEach(() => {
    jest.spyOn(console, 'error').mockImplementation(() => {}); // Mock console.error
    jest.clearAllMocks();
  });

  afterEach(() => {
    (console.error as jest.Mock).mockRestore(); // Pulihkan setelah setiap tes
  });

  it('renders loading indicator while fetching data', () => {
    (getMusicById as jest.Mock).mockImplementation(() => new Promise(() => {})); // Mock pending promise

    const { getByText } = render(
      <NavigationContainer>
        <DetailMusic />
      </NavigationContainer>
    );

    expect(getByText('Loading...')).toBeTruthy();
  });

  it('renders error message when fetch fails', async () => {
    (getMusicById as jest.Mock).mockRejectedValue(new Error('Failed to fetch music details'));

    const { getByText } = render(
      <NavigationContainer>
        <DetailMusic />
      </NavigationContainer>
    );

    await waitFor(() => {
      expect(getByText('Failed to fetch music details')).toBeTruthy();
    });
  });

  it('renders music details when fetch succeeds', async () => {
    (getMusicById as jest.Mock).mockResolvedValue({
      id: '123',
      title: 'Desember',
      artist: 'Efek Rumah Kaca',
      genre: 'Indie',
      releaseYear: 2008,
    });

    const { getByText } = render(
      <NavigationContainer>
        <DetailMusic />
      </NavigationContainer>
    );

    await waitFor(() => {
      expect(getByText('Desember')).toBeTruthy();
      expect(getByText('Artist: Efek Rumah Kaca')).toBeTruthy();
      expect(getByText('Genre: Indie')).toBeTruthy();
      expect(getByText('Release Year: 2008')).toBeTruthy();
    });
  });

  it('navigates to EditMusic screen when Edit button is pressed', async () => {
    (getMusicById as jest.Mock).mockResolvedValue({
      id: '8',
      title: 'Desember',
      artist: 'Efek Rumah Kaca',
      genre: 'Indie',
      releaseYear: 2008,
    });

    const { getByText } = render(
      <NavigationContainer>
        <DetailMusic />
      </NavigationContainer>
    );

    await waitFor(() => {
      fireEvent.press(getByText('Edit'));
      expect(mockNavigate).toHaveBeenCalledWith('EditMusic', { id: '8' });
    });
  });

  it('deletes music and navigates back when Delete button is confirmed', async () => {
    (getMusicById as jest.Mock).mockResolvedValue({
      id: '8',
      title: 'Desember',
      artist: 'Efek Rumah Kaca',
      genre: 'Indie',
      releaseYear: 2008,
    });

    (deleteMusic as jest.Mock).mockResolvedValue(undefined);

    const { getByText } = render(
      <NavigationContainer>
        <DetailMusic />
      </NavigationContainer>
    );

    await waitFor(() => expect(getByText('Delete')).toBeTruthy());

    fireEvent.press(getByText('Delete'));

    expect(Alert.alert).toHaveBeenCalledWith(
      'Confirm Delete',
      'Are you sure you want to delete this music?',
      expect.any(Array),
      { cancelable: true }
    );
  
    // Simulasikan menekan tombol "Delete" pada dialog konfirmasi
    const deleteButtonAction = (Alert.alert as jest.Mock).mock.calls[0][2][1].onPress;
    await deleteButtonAction();
  

    await waitFor(() => {
      expect(deleteMusic).toHaveBeenCalledWith('8');
      expect(mockGoBack).toHaveBeenCalled();
    });
  });
});
