// fronted/babel.config.js
module.exports = function (api) {
    api.cache(true);
    return {
        presets: ['babel-preset-expo'],
        plugins: [
            // Asegúrate de que este plugin esté aquí:
            [
                'module:react-native-dotenv',
                {
                    moduleName: '@env', // Nombre del paquete que importas
                    path: '.env',       // Nombre del archivo que lee
                    safe: false,
                    allowUndefined: true,
                },
            ],
            // Otros plugins (como 'react-native-reanimated/plugin') van después.
        ],
    };
};