import { Controller, Get, Post, Body, Param, Patch, Delete } from "@nestjs/common";
import { SchedulesService } from "./schedules.service";
import { CreateScheduleDto } from "./dto/create-schedule.dto";
import { UpdateScheduleDto } from "./dto/update-schedule.dto";

@Controller("schedules")
export class SchedulesController {
  constructor(private service: SchedulesService) {}

  @Get()
  findAll() {
    return this.service.findAll();
  }

  @Get("barber/:id")
  findByBarber(@Param("id") id: string) {
    return this.service.findByBarber(Number(id));
  }

  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.service.findOne(Number(id));
  }

  @Post()
  create(@Body() body: CreateScheduleDto) {
    return this.service.create(body);
  }

  @Patch(":id")
  update(@Param("id") id: string, @Body() body: UpdateScheduleDto) {
    return this.service.update(Number(id), body);
  }

  @Delete(":id")
  remove(@Param("id") id: string) {
    return this.service.remove(Number(id));
  }
}
