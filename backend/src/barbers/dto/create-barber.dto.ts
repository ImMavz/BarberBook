import { IsNumber, IsOptional, IsString } from "class-validator";

export class CreateBarberDto {
  @IsOptional()
  @IsNumber()
  experiencia?: number;

  @IsOptional()
  @IsString()
  fotoPerfil?: string;

  @IsOptional()
  @IsString()
  descripcion?: string;

  @IsNumber()
  id_usuario: number;

  @IsNumber()
  id_barberia: number;
}
