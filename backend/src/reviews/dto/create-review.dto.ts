import { IsInt, IsOptional, IsString, Min, Max } from "class-validator";

export class CreateReviewDto {
  @IsInt()
  @Min(1)
  @Max(5)
  calificacion: number;

  @IsOptional()
  @IsString()
  comentario?: string | null;

  @IsInt()
  clienteId: number;

  @IsOptional()
  @IsInt()
  barberoId?: number;

  @IsOptional()
  @IsInt()
  barberiaId?: number;
}
