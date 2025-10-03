import { Test, TestingModule } from '@nestjs/testing';
import { SchedBarbershopsService } from './sched-barbershops.service';

describe('SchedBarbershopsService', () => {
  let service: SchedBarbershopsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SchedBarbershopsService],
    }).compile();

    service = module.get<SchedBarbershopsService>(SchedBarbershopsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
