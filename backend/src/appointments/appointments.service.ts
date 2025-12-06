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
    private readonly repo: Repository<Appointment>,

    @InjectRepository(User)
    private readonly usersRepo: Repository<User>,

    @InjectRepository(Barber)
    private readonly barbersRepo: Repository<Barber>,

    @InjectRepository(Service)
    private readonly servicesRepo: Repository<Service>,
  ) {}

  // ==========================================
  // 📌 CREAR CITA — con clienteId del JWT
  // ==========================================
  async create(data: any) {
    // data.clienteId viene del JWT
    const cliente = await this.usersRepo.findOne({
      where: { id: data.clienteId },
    });

    const barbero = await this.barbersRepo.findOne({
      where: { id: data.id_barbero },
    });

    const servicio = await this.servicesRepo.findOne({
      where: { id: data.id_servicio },
    });

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

  // ==========================================
  // 📌 CITAS DE UN CLIENTE
  // ==========================================
  async findByCliente(clienteId: number) {
    return this.repo.find({
      where: { cliente: { id: clienteId } },
      relations: ['barbero', 'servicio'],
      order: { fecha: 'ASC' },
    });
  }

  // ==========================================
  // 📌 CITAS DE UN BARBERO
  // ==========================================
  async findByBarbero(barberoId: number) {
    return this.repo.find({
      where: { barbero: { id: barberoId } },
      relations: ['cliente', 'servicio'],
      order: { fecha: 'ASC' },
    });
  }

  // ==========================================
  // 📌 OBTENER UNA CITA POR ID
  // ==========================================
  async findOne(id: number) {
    const cita = await this.repo.findOne({
      where: { id },
      relations: ['cliente', 'barbero', 'servicio'],
    });

    if (!cita) throw new NotFoundException('Cita no encontrada');
    return cita;
  }

  // ==========================================
  // 📌 CAMBIAR ESTADO
  // ==========================================
  async updateEstado(id: number, estado: string) {
    const cita = await this.findOne(id);
    cita.estado = estado;
    return this.repo.save(cita);
  }

  // ==========================================
  // 📌 ELIMINAR CITA
  // ==========================================
  async remove(id: number) {
    const cita = await this.findOne(id);
    return this.repo.remove(cita);
  }
  async findByBarbershop(barbershopId: number) {
  return this.repo.find({
    where: { barbero: { barberia: { id: barbershopId } } },
    relations: ["barbero", "cliente", "servicio"],
  });
}

}
