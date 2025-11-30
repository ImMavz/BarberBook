import { IsNotEmpty, IsNumber, IsString } from "class-validator";

export class CreateServiceDto {
  @IsString()
  @IsNotEmpty()
  nombre: string;

  @IsNumber()
  precio: number;

  @IsNumber()
  duracion: number;

  @IsNumber()
  barbershopId: number;
}
