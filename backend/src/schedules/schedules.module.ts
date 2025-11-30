import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Schedule } from "./schedule.entity";
import { SchedulesService } from "./schedules.service";
import { SchedulesController } from "./schedules.controller";
import { Barber } from "src/barbers/barber.entity";

@Module({
  imports: [TypeOrmModule.forFeature([Schedule, Barber])],
  providers: [SchedulesService],
  controllers: [SchedulesController],
  exports: [SchedulesService],
})
export class SchedulesModule {}
