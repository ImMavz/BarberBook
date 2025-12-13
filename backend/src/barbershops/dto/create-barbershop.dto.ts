import {
  IsNotEmpty,
  IsOptional,
  IsString,
  IsJSON,
  IsObject,
} from 'class-validator';

export class CreateBarbershopDto {
  @IsString()
  @IsNotEmpty()
  nombre: string;

  @IsString()
  @IsNotEmpty()
  direccion: string;

  @IsOptional()
  @IsObject()
  horariosGlobales?: Record<string, { abre: string; cierra: string } | null>;

  @IsNotEmpty()
  dueñoId: number; // ID del user dueño
}
