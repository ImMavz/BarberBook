import React from 'react';
import { render } from '@testing-library/react-native';
import Header from '../components/header';

jest.mock('../app/context/ThemeContext', () => ({
  useTheme: () => ({ theme: 'light', toggleTheme: jest.fn() }),
}));

describe('Header (fallback test)', () => {
  it('renders title', () => {
    const { getByText } = render(<Header title="Prueba" />);
    expect(getByText('Prueba')).toBeTruthy();
  });
});