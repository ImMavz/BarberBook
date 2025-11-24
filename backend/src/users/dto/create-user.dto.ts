/* eslint-disable @typescript-eslint/no-unsafe-call */

import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';

export class CreateUserDto {
  @IsNotEmpty()
  nombre: string;

  @IsEmail()
  correo: string;

  @MinLength(6)
  contraseña: string;

  @IsNotEmpty()
  rol: string; // 'cliente', 'barbero', 'dueño'
}
