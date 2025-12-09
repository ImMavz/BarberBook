// fronted/src/types/env.d.ts

// Esta declaración le dice a TypeScript que existe un módulo llamado '@env'
declare module '@env' {
    // Aquí declaras todas las variables que tienes en tu archivo .env
    // Asegúrate de que el nombre coincida (API_BASE_URL)
    export const API_BASE_URL: string;
    // Si tienes otras variables, agrégalas también:
    // export const JWT_SECRET: string;
}