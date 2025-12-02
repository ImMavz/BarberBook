import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import * as bcrypt from 'bcrypt';
import { Barber } from 'src/barbers/barber.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,

    @InjectRepository(Barber)
    private readonly barbersRepo: Repository<Barber>,
  ) {}

  async create(dto: CreateUserDto) {
    const existe = await this.usersRepository.findOne({
      where: { correo: dto.correo },
    });

    if (existe) {
      throw new BadRequestException('El correo ya está registrado');
    }

    const user = this.usersRepository.create(dto);

    user.contraseña = await bcrypt.hash(dto.contraseña, 10);

    const saved = await this.usersRepository.save(user);

    const result: any = saved;
    delete result.contraseña;

    return result;
  }

  async findOne(id: number) {
    return this.usersRepository.findOne({ where: { id } });
  }

  async findByEmail(correo: string) {
    return this.usersRepository.findOne({ where: { correo } });
  }

  // 🔥 Usado para AuthService
  async findBarberInfo(userId: number) {
    return await this.barbersRepo.findOne({
      where: { usuario: { id: userId } },
      relations: ['barberia'],
    });
  }
}
