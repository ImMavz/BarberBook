import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { Repository } from  'typeorm'
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from "@nestjs/typeorm";
import { User } from "./entities/user.entity";
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
    ) {}

    async create(createUserDto: CreateUserDto): Promise<User> {

        const existingUser = await this.userRepository.findOne({
            where: { correo: createUserDto.correo} // El correo
        });

        if (existingUser) {
            throw new ConflictException('El correo electrónico ya está registrado');
        }
        //     Hash de la contraseña
        const hashedPassword = await bcrypt.hash(createUserDto.contraseña, 10)

        const user = this.userRepository.create({
            nombre: createUserDto.nombre,        // name → nombre
            correo: createUserDto.correo,        // mail → correo
            contraseña: hashedPassword,        // password → contraseña (hasheada)
            rol: createUserDto.rol            // rol se mantiene igual
        });
        return await this.userRepository.save(user);
    }

    async findAll(): Promise<User[]> {
        return await this.userRepository.find();
    }

    async findOne(id: number): Promise<User> {
        const user = await this.userRepository.findOne({
            where: { id }
        });

        if (!user) {
            throw new NotFoundException(`Usuario con ID ${id} no encontrado`);
        }

        return user;
    }

    async update(id: number, updateUserDto: UpdateUserDto): Promise<User> {
        const user = await this.findOne(id);

        // Mapeo de DTO a Entidad para actualización
        if (updateUserDto.nombre !== undefined) {
            user.nombre = updateUserDto.nombre;
        }
        if (updateUserDto.correo !== undefined) {
            user.correo = updateUserDto.correo;
        }
        if (updateUserDto.rol !== undefined) {
            user.rol = updateUserDto.rol;
        }

        return await this.userRepository.save(user);
    }

    async remove(id: number): Promise<void> {
        const user = await this.findOne(id);
        await this.userRepository.remove(user);
    }

    async findByEmail(mail: string): Promise<User | null> {
        return await this.userRepository.findOne({
            where: { correo: mail } // Busca en BD por 'correo' usando 'mail' del parámetro
        });
    }

    async validateUser(mail: string, password: string): Promise<User | null> {
        const user = await this.findByEmail(mail);

        if (user && await bcrypt.compare(password, user.contraseña)) {
            return user;
        }

        return null;
    }

    async findClientes(): Promise<User[]> {
        return await this.userRepository.find({
            where: { rol: 'client' }
        });
    }

    async findBarberos(): Promise<User[]> {
        return await this.userRepository.find({
            where: { rol: 'barber' }
        });
    }

    async findDuenos(): Promise<User[]> {
        return await this.userRepository.find({
            where: { rol: 'owner' }
        });
    }

// METODO PARA CONTAR USUARIOS POR ROL (ÚTIL PARA DASHBOARD)
    async countByRol(): Promise<{ client: number; barber: number; owner: number }> {
        const [clientes, barberos, duenos] = await Promise.all([
            this.userRepository.count({ where: { rol: 'client' } }),
            this.userRepository.count({ where: { rol: 'barber' } }),
            this.userRepository.count({ where: { rol: 'owner' } })
        ]);

        return {
            client: clientes,
            barber: barberos,
            owner: duenos
        };
    }

    // ETODO PARA CAMBIAR ROL DE USUARIO
    async cambiarRol(id: number, nuevoRol: string): Promise<User> {
        const user = await this.findOne(id);
        user.rol = nuevoRol;
        return await this.userRepository.save(user);
    }
}