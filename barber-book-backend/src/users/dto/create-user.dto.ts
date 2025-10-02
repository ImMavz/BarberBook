import { IsString, IsEmail, IsEnum, MinLength } from 'class-validator';

export enum UserRole {
    CLIENTE = 'cliente',
    BARBERO = 'barbero',
    DUEÑO = 'dueño'
}

export class CreateUserDto {
    @IsString()
    @MinLength(2, { message: 'El nombre debe tener al menos 2 caracteres' })
    nombre: string;

    @IsEmail({}, { message: 'Debe ser un correo electrónico válido' })
    correo: string;

    @IsString()
    @MinLength(6, { message: 'La contraseña debe tener al menos 6 caracteres' })
    contraseña: string;

    @IsEnum(UserRole, {
        message: 'El rol debe ser: cliente, barbero o dueño'
    })
    rol: UserRole;
}