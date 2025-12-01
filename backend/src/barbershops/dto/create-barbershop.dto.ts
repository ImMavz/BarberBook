import { IsNotEmpty, IsOptional, IsString, IsJSON } from "class-validator";

export class CreateBarbershopDto {
  @IsString()
  @IsNotEmpty()
  nombre: string;

  @IsString()
  @IsNotEmpty()
  direccion: string;

  @IsOptional()
  horariosGlobales?: any;

  @IsNotEmpty()
  dueñoId: number; // ID del user dueño
}
