import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Appointment } from './appointment.entity';
import { Repository } from 'typeorm';
import { User } from 'src/users/user.entity';
import { Barber } from 'src/barbers/barber.entity';
import { Service } from 'src/services/service.entity';

@Injectable()
export class AppointmentsService {
  constructor(
    @InjectRepository(Appointment)
    private repo: Repository<Appointment>,

    @InjectRepository(User)
    private usersRepo: Repository<User>,

    @InjectRepository(Barber)
    private barbersRepo: Repository<Barber>,

    @InjectRepository(Service)
    private servicesRepo: Repository<Service>,
  ) {}

  // Crear cita
  async create(data: any) {
    const cliente = await this.usersRepo.findOne({ where: { id: data.id_cliente } });
    const barbero = await this.barbersRepo.findOne({ where: { id: data.id_barbero } });
    const servicio = await this.servicesRepo.findOne({ where: { id: data.id_servicio } });

    if (!cliente) throw new NotFoundException('Cliente no encontrado');
    if (!barbero) throw new NotFoundException('Barbero no encontrado');
    if (!servicio) throw new NotFoundException('Servicio no encontrado');

    const cita = this.repo.create({
      fecha: data.fecha,
      horaInicio: data.horaInicio,
      horaFin: data.horaFin,
      estado: 'pendiente',
      cliente,
      barbero,
      servicio,
    });

    return this.repo.save(cita);
  }

  // Obtener todas las citas por cliente
  async findByCliente(id_cliente: number) {
    return this.repo.find({
      where: { cliente: { id: id_cliente } },
      relations: ['barbero', 'servicio'],
      order: { fecha: 'ASC' },
    });
  }

  // Obtener todas las citas por barbero
  async findByBarbero(id_barbero: number) {
    return this.repo.find({
      where: { barbero: { id: id_barbero } },
      relations: ['cliente', 'servicio'],
      order: { fecha: 'ASC' },
    });
  }

  // Obtener una cita por ID
  async findOne(id: number) {
    const cita = await this.repo.findOne({
      where: { id },
      relations: ['cliente', 'barbero', 'servicio'],
    });

    if (!cita) throw new NotFoundException('Cita no encontrada');
    return cita;
  }

  // Cambiar estado: pendiente / completada / cancelada
  async updateEstado(id: number, estado: string) {
    const cita = await this.findOne(id);
    cita.estado = estado;
    return this.repo.save(cita);
  }

  // Eliminar cita
  async remove(id: number) {
    const cita = await this.findOne(id);
    return this.repo.remove(cita);
  }
}
