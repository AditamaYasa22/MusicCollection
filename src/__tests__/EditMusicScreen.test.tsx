import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import EditMusicScreen from '../screens/EditMusicScreen';
import { getMusicById, updateMusic } from '../api/api';
import { NavigationContainer } from '@react-navigation/native';
import { Alert } from 'react-native';

// Mock fungsi API
jest.mock('../api/api', () => ({
  getMusicById: jest.fn(),
  updateMusic: jest.fn(),
}));

// Mock navigasi
const mockGoBack = jest.fn();
jest.mock('@react-navigation/native', () => {
  const actualNav = jest.requireActual('@react-navigation/native');
  return {
    ...actualNav,
    useNavigation: () => ({
      goBack: mockGoBack,
    }),
    useRoute: () => ({
      params: { id: '5' },
    }),
  };
});

jest.spyOn(Alert, 'alert').mockImplementation((title, message, buttons) => {
  if (buttons && buttons[0].onPress) buttons[0].onPress();
});

describe('EditMusicScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders loading indicator while fetching data', () => {
    (getMusicById as jest.Mock).mockImplementation(() => new Promise(() => {})); // Mock pending promise

    const { getByText, getByTestId } = render(
      <NavigationContainer>
        <EditMusicScreen />
      </NavigationContainer>
    );

    expect(getByTestId('loading-indicator')).toBeTruthy();
    expect(getByText('Loading...')).toBeTruthy();
  });

  it('renders error message when fetch fails', async () => {
    (getMusicById as jest.Mock).mockRejectedValue({
      response: {
        data: {
          message: 'Failed to fetch music details',
        },
      },
    });

    const { getByText } = render(
      <NavigationContainer>
        <EditMusicScreen />
      </NavigationContainer>
    );

    await waitFor(() => {
      expect(getByText('An unexpected error occurred')).toBeTruthy();
      expect(getByText('Retry')).toBeTruthy();
    });
  });

  it('renders music details when fetch succeeds', async () => {
    (getMusicById as jest.Mock).mockResolvedValue({
      title: 'Desember',
      artist: 'Efek Rumah Kaca',
      genre: 'Indie',
      releaseYear: 2008,
    });

    const { getByPlaceholderText } = render(
      <NavigationContainer>
        <EditMusicScreen />
      </NavigationContainer>
    );

    await waitFor(() => {
      expect(getByPlaceholderText('Title').props.value).toBe('Desember');
      expect(getByPlaceholderText('Artist').props.value).toBe('Efek Rumah Kaca');
      expect(getByPlaceholderText('Genre').props.value).toBe('Indie');
      expect(getByPlaceholderText('Release Year').props.value).toBe("2008");
    });
  });

  it('shows validation alert when fields are empty or invalid', async () => {
    (getMusicById as jest.Mock).mockResolvedValue({
      title: 'Desember',
      artist: 'Efek Rumah Kaca',
      genre: 'Indie',
      releaseYear: 2008,
    });

    const { getByText, getByPlaceholderText } = render(
      <NavigationContainer>
        <EditMusicScreen />
      </NavigationContainer>
    );

    await waitFor(() => expect(getByPlaceholderText('Title')).toBeTruthy());

    fireEvent.changeText(getByPlaceholderText('Title'), '');
    fireEvent.press(getByText('Update Music'));

    await waitFor(() => {
      expect(Alert.alert).toHaveBeenCalledWith(
        'Validation Error',
        'All fields are required, and Release Year must be a valid number.'
      );
      expect(updateMusic).not.toHaveBeenCalled(); // Pastikan updateMusic tidak dipanggil
    });
  });

  it('calls updateMusic and navigates back on valid input', async () => {
    console.log('Test started');
    (getMusicById as jest.Mock).mockResolvedValue({
      title: 'Desember',
      artist: 'Efek Rumah Kaca',
      genre: 'Indie',
      releaseYear: 2008,
    });

    (updateMusic as jest.Mock).mockResolvedValueOnce({});

    const { getByText, getByPlaceholderText} = render(
      <NavigationContainer>
        <EditMusicScreen />
      </NavigationContainer>
    );

    await waitFor(() => expect(getByPlaceholderText('Title')).toBeTruthy());
    console.log('Title field available');

  fireEvent.changeText(getByPlaceholderText('Title'), 'September Ceria');
  fireEvent.changeText(getByPlaceholderText('Artist'), 'Vina Panduwinata');
  fireEvent.changeText(getByPlaceholderText('Genre'), 'Indo Pop');
  fireEvent.changeText(getByPlaceholderText('Release Year'), '2006');
  console.log('Fields updated');
    
    fireEvent.press(getByText('Update Music'));
    console.log('Update Music button pressed');
    

    await waitFor(() => {
      expect(updateMusic).toHaveBeenCalledWith('5', {
        title: 'September Ceria',
        artist: 'Vina Panduwinata',
        genre: 'Indo Pop',
        releaseYear: 2006,
      });
      console.log('updateMusic called');
    });

    await waitFor(() => {
      expect(mockGoBack).toHaveBeenCalled();
      console.log('mockGoBack called');
});
});
});
