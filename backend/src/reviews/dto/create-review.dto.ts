import { IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";

export class CreateReviewDto {
  @IsNumber()
  @IsNotEmpty()
  calificacion: number;

  @IsString()
  @IsOptional()
  comentario?: string;

  @IsNotEmpty()
  clienteId: number;

  @IsOptional()
  barberoId?: number;

  @IsOptional()
  barberiaId?: number;
}
