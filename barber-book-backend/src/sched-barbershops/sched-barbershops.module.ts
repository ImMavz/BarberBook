import { Module } from '@nestjs/common';
import { SchedBarbershopsService } from './sched-barbershops.service';
import { SchedBarbershopsController } from './sched-barbershops.controller';

@Module({
  controllers: [SchedBarbershopsController],
  providers: [SchedBarbershopsService],
})
export class SchedBarbershopsModule {}
