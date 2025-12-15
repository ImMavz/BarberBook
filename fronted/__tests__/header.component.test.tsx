import React from 'react';
import { render } from '@testing-library/react-native';
import Header from '../components/header';

// Mock de useTheme (la ruta real es '../app/context/ThemeContext')
jest.mock('../app/context/ThemeContext', () => ({
  useTheme: () => ({ theme: 'light', toggleTheme: jest.fn() }),
}));

describe('Header component (integración básica)', () => {
  it('muestra el título recibido por props', () => {
    const { getByText } = render(<Header title="Hola Barber" />);
    expect(getByText('Hola Barber')).toBeTruthy();
  });
});
