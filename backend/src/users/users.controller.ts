import { 
  Controller, 
  Post, 
  Body, 
  Get, 
  Req, 
  UseGuards 
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  // Crear usuario
  @Post()
  async create(@Body() body: CreateUserDto) {
    console.log('BODY RECIBIDO →', body);
    return this.usersService.create(body);
  }

  // Obtener perfil del usuario autenticado
  @UseGuards(JwtAuthGuard)
  @Get('me')
  async getProfile(@Req() req) {
    // req.user viene del payload del JWT (sub = id del usuario)
    return this.usersService.findOne(req.user.sub);
  }

  @UseGuards(JwtAuthGuard)
@Get('barberos-disponibles')
async getBarberosDisponibles() {
  return this.usersService.findBarberosDisponibles();
  }
}