import { IsInt, IsOptional, IsString, Min, Max } from "class-validator";

export class CreateReviewDto {
  // ⭐ BARBERO
  @IsInt()
  @Min(1)
  @Max(5)
  calificacionBarbero: number;

  @IsOptional()
  @IsString()
  comentarioBarbero?: string | null;

  // ⭐ BARBERÍA
  @IsInt()
  @Min(1)
  @Max(5)
  calificacionBarberia: number;

  @IsOptional()
  @IsString()
  comentarioBarberia?: string | null;

  // 🔗 IDs
  @IsInt()
  barberoId: number;

  @IsInt()
  barberiaId: number;

  @IsInt()
  citaId: number;
}
