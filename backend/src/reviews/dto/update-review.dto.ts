import { PartialType } from "@nestjs/mapped-types";
import { CreateReviewDto } from "./create-review.dto";
import { IsInt, IsOptional, IsString, Min, Max } from "class-validator";

export class UpdateReviewDto extends PartialType(CreateReviewDto) {
  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(5)
  calificacion?: number;

  @IsOptional()
  @IsString()
  comentario?: string | null;

  @IsOptional()
  @IsInt()
  clienteId?: number;

  @IsOptional()
  @IsInt()
  barberoId?: number;

  @IsOptional()
  @IsInt()
  barberiaId?: number;
}
