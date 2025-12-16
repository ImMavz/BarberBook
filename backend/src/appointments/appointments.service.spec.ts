import { Test, TestingModule } from '@nestjs/testing';
import { AppointmentsService } from './appointments.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Appointment } from './appointment.entity';
import { User } from 'src/users/user.entity';
import { Barber } from 'src/barbers/barber.entity';
import { Service } from 'src/services/service.entity';
import { Repository } from 'typeorm';
import { MailService } from 'src/mail/mail.service';
import { NotFoundException, ConflictException } from '@nestjs/common';

type MockRepo<T = any> = Partial<Record<keyof Repository<T>, jest.Mock>>;

const mockRepo = () => ({
  findOne: jest.fn(),
  find: jest.fn(),
  create: jest.fn(),
  save: jest.fn(),
  remove: jest.fn(),
});

describe('AppointmentsService', () => {
  let service: AppointmentsService;
  let repo: MockRepo<Appointment>;
  let usersRepo: MockRepo<User>;
  let barbersRepo: MockRepo<Barber>;
  let servicesRepo: MockRepo<Service>;
  let mailService: MailService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AppointmentsService,
        { provide: getRepositoryToken(Appointment), useValue: mockRepo() },
        { provide: getRepositoryToken(User), useValue: mockRepo() },
        { provide: getRepositoryToken(Barber), useValue: mockRepo() },
        { provide: getRepositoryToken(Service), useValue: mockRepo() },
        {
          provide: MailService,
          useValue: { sendAppointmentConfirmation: jest.fn(), sendNewAppointmentNotification: jest.fn() },
        },
      ],
    }).compile();

    service = module.get<AppointmentsService>(AppointmentsService);
    repo = module.get(getRepositoryToken(Appointment));
    usersRepo = module.get(getRepositoryToken(User));
    barbersRepo = module.get(getRepositoryToken(Barber));
    servicesRepo = module.get(getRepositoryToken(Service));
    mailService = module.get(MailService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a new appointment and send emails', async () => {
      const data = { clienteId: 1, id_barbero: 2, id_servicio: 3, fecha: '2025-12-16', horaInicio: '10:00:00', horaFin: '11:00:00' };
      const cliente = { id: 1, correo: 'c@test.com', nombre: 'Cliente' };
      const barbero = { id: 2, usuario: { nombre: 'Barbero', correo: 'b@test.com' } };
      const servicio = { id: 3, nombre: 'Corte' };
      const cita = { ...data, cliente, barbero, servicio, id: 1 };

      usersRepo.findOne.mockResolvedValue(cliente as any);
      barbersRepo.findOne.mockResolvedValue(barbero as any);
      servicesRepo.findOne.mockResolvedValue(servicio as any);
      repo.findOne.mockResolvedValue(null);
      repo.create.mockReturnValue(cita as any);
      repo.save.mockResolvedValue(cita as any);

      const result = await service.create(data as any);
      expect(result).toEqual(cita);
      expect(mailService.sendAppointmentConfirmation).toHaveBeenCalled();
      expect(mailService.sendNewAppointmentNotification).toHaveBeenCalled();
    });

    it('should throw NotFoundException if client, barber or service does not exist', async () => {
      usersRepo.findOne.mockResolvedValue(null);
      await expect(service.create({ clienteId: 1, id_barbero: 2, id_servicio: 3 } as any)).rejects.toThrow(NotFoundException);
    });

    it('should throw ConflictException if appointment exists', async () => {
      usersRepo.findOne.mockResolvedValue({ id: 1 } as any);
      barbersRepo.findOne.mockResolvedValue({ id: 2, usuario: {} } as any);
      servicesRepo.findOne.mockResolvedValue({ id: 3 } as any);
      repo.findOne.mockResolvedValue({ id: 10 } as any);

      await expect(service.create({ clienteId: 1, id_barbero: 2, id_servicio: 3, fecha: '2025-12-16', horaInicio: '10:00:00' } as any)).rejects.toThrow(ConflictException);
    });
  });

  describe('findByCliente', () => {
    it('should return client appointments', async () => {
      const citas = [{ id: 1, fecha: new Date(), horaInicio: '10:00:00' }];
      repo.find.mockResolvedValue(citas as any);

      const result = await service.findByCliente(1);
      expect(result).toEqual(citas.map(c => service.cleanDates(c)));
    });
  });

  describe('findByBarbero', () => {
    it('should return barber appointments', async () => {
      const citas = [{ id: 1 }];
      repo.find.mockResolvedValue(citas as any);

      const result = await service.findByBarbero(2);
      expect(result).toEqual(citas.map(c => service.cleanDates(c)));
    });
  });

  describe('findByBarbershop', () => {
    it('should return appointments by barbershop', async () => {
      const citas = [{ id: 1 }];
      repo.find.mockResolvedValue(citas as any);

      const result = await service.findByBarbershop(1);
      expect(result).toEqual(citas);
    });
  });

  describe('findOne', () => {
    it('should return appointment by id', async () => {
      const cita = { id: 1 };
      repo.findOne.mockResolvedValue(cita as any);

      expect(await service.findOne(1)).toEqual(cita);
    });

    it('should throw NotFoundException if not found', async () => {
      repo.findOne.mockResolvedValue(null);
      await expect(service.findOne(1)).rejects.toThrow(NotFoundException);
    });
  });

  describe('updateEstado', () => {
    it('should update appointment state', async () => {
      const cita = { id: 1, estado: 'pendiente' };
      repo.findOne.mockResolvedValue(cita as any);
      repo.save.mockResolvedValue({ ...cita, estado: 'completado' } as any);

      const result = await service.updateEstado(1, 'completado');
      expect(result.estado).toEqual('completado');
    });
  });

  describe('remove', () => {
    it('should remove appointment', async () => {
      const cita = { id: 1 };
      repo.findOne.mockResolvedValue(cita as any);
      repo.remove.mockResolvedValue(cita as any);

      expect(await service.remove(1)).toEqual(cita);
    });
  });

  describe('cleanDates', () => {
    it('should format dates correctly', () => {
      const cita = { fecha: new Date('2025-12-16'), horaInicio: '10:00:00', horaFin: '11:00:00' } as any;
      const result = service.cleanDates(cita);
      expect(result.fecha).toEqual(String(cita.fecha));
      expect(result.horaInicio).toBe('10:00:00');
      expect(result.horaFin).toBe('11:00:00');
    });
  });
});
