import { Test, TestingModule } from '@nestjs/testing';
import { SchedBarbershopsController } from './sched-barbershops.controller';
import { SchedBarbershopsService } from './sched-barbershops.service';

describe('SchedBarbershopsController', () => {
  let controller: SchedBarbershopsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SchedBarbershopsController],
      providers: [SchedBarbershopsService],
    }).compile();

    controller = module.get<SchedBarbershopsController>(SchedBarbershopsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
