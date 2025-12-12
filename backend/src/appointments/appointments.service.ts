import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Appointment } from './appointment.entity';
import { Repository } from 'typeorm';
import { User } from 'src/users/user.entity';
import { Barber } from 'src/barbers/barber.entity';
import { Service } from 'src/services/service.entity';
import { MailService } from 'src/mail/mail.service';

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

    private readonly mailService: MailService,
  ) { }

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
      relations: ['usuario'],
    });

    const servicio = await this.servicesRepo.findOne({
      where: { id: data.id_servicio },
    });

    if (!cliente) throw new NotFoundException('Cliente no encontrado');
    if (!barbero) throw new NotFoundException('Barbero no encontrado');
    if (!servicio) throw new NotFoundException('Servicio no encontrado');

    const existe = await this.repo.findOne({
      where: {
        barbero: { id: data.id_barbero },
        fecha: data.fecha,
        horaInicio: data.horaInicio,
      },
    });

    if (existe) {
      throw new ConflictException('Ya existe una cita en este horario');
    }

    const cita = this.repo.create({
      fecha: data.fecha,
      horaInicio: data.horaInicio,
      horaFin: data.horaFin,
      estado: 'pendiente',
      cliente,
      barbero,
      servicio,
    });

    const savedCita = await this.repo.save(cita);

    // Enviar email de confirmación al CLIENTE
    if (cliente.correo) {
      await this.mailService.sendAppointmentConfirmation(cliente.correo, {
        fecha: savedCita.fecha,
        horaInicio: savedCita.horaInicio,
        barbero: barbero.usuario.nombre,
        servicio: servicio.nombre,
      });
    }

    // Enviar notificación al BARBERO
    if (barbero.usuario && barbero.usuario.correo) {
      await this.mailService.sendNewAppointmentNotification(barbero.usuario.correo, {
        fecha: savedCita.fecha,
        horaInicio: savedCita.horaInicio,
        cliente: cliente.nombre,
        servicio: servicio.nombre,
      });
    }

    return savedCita;
  }

  // ==========================================
  // 📌 CITAS DE UN CLIENTE
  // ==========================================
  async findByCliente(clienteId: number) {
    const citas = await this.repo.find({
      where: { cliente: { id: clienteId } },
      relations: [
        "barbero",
        "barbero.usuario",
        "barbero.barberia",
        "servicio"
      ],
      order: { fecha: "ASC" },
    });

    return citas.map(c => this.cleanAppointmentDates(c));
  }




  cleanAppointmentDates(cita: Appointment) {
    const fecha = String(cita.fecha); // 🔥 siempre string
    const horaInicio = (cita.horaInicio ?? "00:00:00").slice(0, 8);
    const horaFin = (cita.horaFin ?? "00:00:00").slice(0, 8);

    return {
      ...cita,
      fecha,
      horaInicio,
      horaFin,
    };
  }




  // ==========================================
  // 📌 CITAS DE UN BARBERO
  // ==========================================
  async findByBarbero(barberoId: number) {
    const citas = await this.repo.find({
      where: { barbero: { id: barberoId } },
      relations: ['cliente', 'servicio'],
      order: { fecha: 'ASC' },
    });

    return citas.map(c => this.cleanAppointmentDates(c));
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
