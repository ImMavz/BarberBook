import { Controller, Post, Body, Get, Param, Patch, Delete } from '@nestjs/common';
import { AppointmentsService } from './appointments.service';

@Controller('appointments')
export class AppointmentsController {
  constructor(private service: AppointmentsService) {}

  @Post()
  create(@Body() body: any) {
    return this.service.create(body);
  }

  @Get('cliente/:id')
  getByCliente(@Param('id') id: number) {
    return this.service.findByCliente(Number(id));
  }

  @Get('barbero/:id')
  getByBarbero(@Param('id') id: number) {
    return this.service.findByBarbero(Number(id));
  }

  @Get(':id')
  getOne(@Param('id') id: number) {
    return this.service.findOne(Number(id));
  }

  @Patch(':id/estado')
  updateEstado(@Param('id') id: number, @Body('estado') estado: string) {
    return this.service.updateEstado(Number(id), estado);
  }

  @Delete(':id')
  delete(@Param('id') id: number) {
    return this.service.remove(Number(id));
  }
}
