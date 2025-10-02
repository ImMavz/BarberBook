import { IsInt, IsString, IsOptional, IsUrl, Min, Max } from 'class-validator';

export class CreateBarberDto {
    @IsInt()
    usuarioId: number;

    @IsInt()
    barberiaId: number;

    @IsString()
    @IsOptional()
    @IsUrl()
    fotoPerfil?: string;

    @IsString()
    @IsOptional()
    descripcion?: string;

    @IsInt()
    @IsOptional()
    @Min(0)
    @Max(50)
    experiencia?: number;
}