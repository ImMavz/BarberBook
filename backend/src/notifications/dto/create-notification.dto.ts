import { IsNotEmpty, IsString } from "class-validator";

export class CreateNotificationDto {
  @IsString()
  @IsNotEmpty()
  mensaje: string;

  @IsString()
  @IsNotEmpty()
  tipo: string;

  @IsNotEmpty()
  usuarioId: number; // FK obligatorio
}
