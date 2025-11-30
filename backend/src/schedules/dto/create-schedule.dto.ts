import { IsBoolean, IsNotEmpty, IsOptional, IsString } from "class-validator";

export class CreateScheduleDto {
  @IsString()
  @IsNotEmpty()
  diaSemana: string;

  @IsString()
  @IsNotEmpty()
  horaInicio: string;

  @IsString()
  @IsNotEmpty()
  horaFin: string;

  @IsBoolean()
  @IsOptional()
  disponible?: boolean;

  @IsNotEmpty()
  barberoId: number;
}
