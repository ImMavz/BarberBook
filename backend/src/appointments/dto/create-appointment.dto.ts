import { IsNotEmpty, IsString, IsNumber } from "class-validator";

export class CreateAppointmentDto {
  @IsNotEmpty()
  @IsString()
  fecha: string;

  @IsNotEmpty()
  @IsString()
  horaInicio: string;

  @IsNotEmpty()
  @IsString()
  horaFin: string;

  @IsNotEmpty()
  @IsNumber()
  id_barbero: number;

  @IsNotEmpty()
  @IsNumber()
  id_servicio: number;
}
