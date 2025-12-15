import React from 'react';
import { render } from '@testing-library/react-native';
import Header from '../components/header'; // ruta correcta al componente

jest.mock('../app/context/ThemeContext', () => ({
  useTheme: () => ({ theme: 'light', toggleTheme: jest.fn() }),
}));

describe('Header component', () => {
  it('muestra el título recibido por props', () => {
    const { getByText } = render(<Header title="Hola Barber" />);
    expect(getByText('Hola Barber')).toBeTruthy();
  });
});