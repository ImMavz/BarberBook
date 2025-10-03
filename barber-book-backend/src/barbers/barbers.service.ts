import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Barber } from './entities/barber.entity';
import { CreateBarberDto } from './dto/create-barber.dto';
import { UpdateBarberDto } from './dto/update-barber.dto';

@Injectable()
export class BarbersService {
    constructor(
        @InjectRepository(Barber)
        private readonly barberRepository: Repository<Barber>,
    ) {}

    async create(createBarberDto: CreateBarberDto): Promise<Barber> {
        const barber = this.barberRepository.create(createBarberDto);
        return await this.barberRepository.save(barber);
    }

    async findAll(): Promise<Barber[]> {
        return await this.barberRepository.find();
    }

    async findOne(id: number): Promise<Barber> {
        const barber = await this.barberRepository.findOne({
            where: { id }
        });

        if (!barber) {
            throw new NotFoundException(`Barbero con ID ${id} no encontrado`);
        }

        return barber;
    }

    async update(id: number, updateBarberDto: UpdateBarberDto): Promise<Barber> {
        const barber = await this.findOne(id);
        Object.assign(barber, updateBarberDto);
        return await this.barberRepository.save(barber);
    }

    async remove(id: number): Promise<void> {
        const barber = await this.findOne(id);
        await this.barberRepository.remove(barber);
    }
}