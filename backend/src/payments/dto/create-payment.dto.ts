import { IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";

export class CreatePaymentDto {
  @IsNumber()
  @IsNotEmpty()
  monto: number;

  @IsString()
  @IsNotEmpty()
  estado: string;

  @IsString()
  @IsOptional()
  metodo?: string;

  @IsNotEmpty()
  barberoId: number;
}