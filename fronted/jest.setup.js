import '@testing-library/jest-native/extend-expect';

// Evita warnings de Animated en tests (si la ruta existe en la versión de RN usada)
try {
	jest.mock('react-native/Libraries/Animated/src/NativeAnimatedHelper');
} catch (e) {
	// ruta no disponible: ignorar
}

// Si necesitas mockear fetch global, puedes habilitarlo aquí. Ejemplo:
// global.fetch = jest.fn();

// Mock de AsyncStorage para tests (si está instalado)
try {
	// usa el mock recomendado del paquete si está disponible
	try {
		jest.mock('@react-native-async-storage/async-storage', () =>
			require('@react-native-async-storage/async-storage/jest/async-storage-mock')
		);
	} catch (e) {
		// si no existe el mock oficial, crear un mock simple
		jest.mock('@react-native-async-storage/async-storage', () => ({
			setItem: jest.fn(() => Promise.resolve(null)),
			getItem: jest.fn(() => Promise.resolve(null)),
			removeItem: jest.fn(() => Promise.resolve(null)),
			clear: jest.fn(() => Promise.resolve(null)),
		}));
	}
} catch (e) {
	// no está instalado o no hay mock disponible: ignorar
}

// Mock simple para @expo/vector-icons para evitar actualizaciones de estado
try {
	jest.mock('@expo/vector-icons', () => {
		const React = require('react');
		const { Text } = require('react-native');
		return {
			Ionicons: (props) => React.createElement(Text, { testID: 'icon' }, ''),
			MaterialIcons: (props) => React.createElement(Text, { testID: 'icon' }, ''),
		};
	});
} catch (e) {
	// ignore
}
