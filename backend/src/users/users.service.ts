import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) {}

  async create(dto: CreateUserDto) {
    // Validar correo único
    const existe = await this.usersRepository.findOne({
      where: { correo: dto.correo },
    });

    if (existe) {
      throw new BadRequestException('El correo ya está registrado');
    }

    // Crear usuario desde DTO
    const user = this.usersRepository.create(dto);

    // Hash contraseña
    user.contraseña = await bcrypt.hash(dto.contraseña, 10);

    // Guardar
    const saved = await this.usersRepository.save(user);

    // Quitar contraseña de la respuesta
    const result: any = saved;
    delete result.contraseña;

    return result;
  }

  // 🔥 ESTA ERA LA FUNCIÓN QUE FALLABA
  async findOne(id: number) {
    return this.usersRepository.findOne({ where: { id } });
  }

  async findByEmail(correo: string) {
    return this.usersRepository.findOne({ where: { correo } });
  }
}
