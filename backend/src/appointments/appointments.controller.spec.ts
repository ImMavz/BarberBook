import { Test, TestingModule } from '@nestjs/testing';
import { AppointmentsController } from './appointments.controller';
import { AppointmentsService } from './appointments.service';
import { BadRequestException } from '@nestjs/common';

describe('AppointmentsController', () => {
  let controller: AppointmentsController;
  let service: AppointmentsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AppointmentsController],
      providers: [
        {
          provide: AppointmentsService,
          useValue: {
            updateEstado: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<AppointmentsController>(AppointmentsController);
    service = module.get<AppointmentsService>(AppointmentsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('updateEstado', () => {
  let controller: AppointmentsController;
  let service: AppointmentsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AppointmentsController],
      providers: [
        {
          provide: AppointmentsService,
          useValue: {
            updateEstado: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<AppointmentsController>(AppointmentsController);
    service = module.get<AppointmentsService>(AppointmentsService);
  });

  it('should throw BadRequestException for invalid state', () => {
  const id = '1';
  const invalidEstado = 'invalid';

  expect(() => controller.updateEstado(id, invalidEstado)).toThrow(BadRequestException);
});

  it('should call service.updateEstado for valid state', async () => {
    const id = '1';
    const validEstado = 'pendiente';
    const updateMock = jest.spyOn(service, 'updateEstado').mockResolvedValue({ success: true });

    const result = await controller.updateEstado(id, validEstado);

    expect(updateMock).toHaveBeenCalledWith(Number(id), validEstado);
    expect(result).toEqual({ success: true });
  });
});

});
