import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Controller('usuarios')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

    @Post()
    create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
    }

    @Get()
    findAll() {
    return this.usersService.findAll();
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
    return this.usersService.findOne(+id);
    }

    @Patch(':id')
    update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(+id, updateUserDto);
    }

    @Delete(':id')
    remove(@Param('id') id: string) {
    return this.usersService.remove(+id);
    }

    @Get('clientes')
    findClientes() {
        return this.usersService.findClientes();
    }

    @Get('barberos')
    findBarberos() {
        return this.usersService.findBarberos();
    }

    @Get('dueños')
    findDuenos() {
        return this.usersService.findDuenos();
    }

    @Get('estadisticas/roles') // GET /users/estadisticas/roles
    countByRol() {
        return this.usersService.countByRol();
    }

    @Patch(':id/cambiar-rol') // PATCH /users/1/cambiar-rol
    cambiarRol(@Param('id') id: string, @Body('rol') nuevoRol: string) {
        return this.usersService.cambiarRol(+id, nuevoRol);
    }
}
