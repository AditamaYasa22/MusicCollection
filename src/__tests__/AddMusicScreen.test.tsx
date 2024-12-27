import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import AddMusicScreen from '../screens/AddMusicScreen'; // Pastikan path sesuai
import { createMusic } from '../api/api';
import { NavigationContainer } from '@react-navigation/native';

// Mock fungsi `createMusic`
jest.mock('../api/api', () => ({
  createMusic: jest.fn(),
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
  };
});

describe('AddMusicScreen', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders all input fields and the button', () => {
    const { getByPlaceholderText, getByText } = render(
      <NavigationContainer>
        <AddMusicScreen />
      </NavigationContainer>
    );

    expect(getByPlaceholderText('Title')).toBeTruthy();
    expect(getByPlaceholderText('Artist')).toBeTruthy();
    expect(getByPlaceholderText('Genre')).toBeTruthy();
    expect(getByPlaceholderText('Release Year')).toBeTruthy();
    expect(getByText('Add Music')).toBeTruthy();
  });

  it('shows an error alert when required fields are empty', () => {
    const { getByText } = render(
      <NavigationContainer>
        <AddMusicScreen />
      </NavigationContainer>
    );

    fireEvent.press(getByText('Add Music'));

    expect(createMusic).not.toHaveBeenCalled();
  });

  it('calls createMusic and navigates back on valid input', async () => {
    const { getByPlaceholderText, getByText } = render(
      <NavigationContainer>
        <AddMusicScreen />
      </NavigationContainer>
    );

    fireEvent.changeText(getByPlaceholderText('Title'), 'Desember');
    fireEvent.changeText(getByPlaceholderText('Artist'), 'Efek Rumah Kaca');
    fireEvent.changeText(getByPlaceholderText('Genre'), 'Pop');
    fireEvent.changeText(getByPlaceholderText('Release Year'), '2023');

    fireEvent.press(getByText('Add Music'));

    await waitFor(() => {
      expect(createMusic).toHaveBeenCalledWith({
        title: 'Desember',
        artist: 'Efek Rumah Kaca',
        genre: 'Pop',
        releaseYear: 2023,
      });
      expect(mockGoBack).toHaveBeenCalled();
    });
  });
});
