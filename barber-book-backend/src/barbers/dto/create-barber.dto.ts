import { IsInt, IsString, IsOptional, IsUrl, Min, Max } from 'class-validator';

export class CreateBarberDto {
    @IsInt({ message: 'El ID de usuario debe ser un número' })
    usuarioId: number;

    @IsInt({ message: 'El ID de barbería debe ser un número' })
    barberiaId: number;

    @IsString()
    @IsOptional()
    @IsUrl({}, { message: 'La foto de perfil debe ser una URL válida' })
    fotoPerfil?: string;

    @IsString()
    @IsOptional()
    descripcion?: string;

    @IsInt()
    @IsOptional()
    @Min(0, { message: 'La experiencia no puede ser negativa' })
    @Max(50, { message: 'La experiencia no puede ser mayor a 50 años' })
    experiencia?: number;
}