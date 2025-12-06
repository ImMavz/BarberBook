import {
  Controller,
  Post,
  Body,
  UseGuards,
  Request,
  Get,
  Param,
  Patch,
  Delete,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { AppointmentsService } from './appointments.service';
import { CreateAppointmentDto } from './dto/create-appointment.dto';

@Controller('appointments')
export class AppointmentsController {
  constructor(private readonly service: AppointmentsService) {}

  // 👉 Crear una cita (solo clientes logueados)
  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Request() req, @Body() dto: CreateAppointmentDto) {
    const clienteId = req.user.id; // viene del JWT
    return this.service.create({ ...dto, clienteId });
  }

  // 👉 Obtener citas de un cliente
  @UseGuards(JwtAuthGuard)
  @Get('cliente/:id')
  getByCliente(@Param('id') id: number) {
    return this.service.findByCliente(Number(id));
  }

  // 👉 Obtener citas de un barbero
  @UseGuards(JwtAuthGuard)
  @Get('barbero/:id')
  getByBarbero(@Param('id') id: number) {
    return this.service.findByBarbero(Number(id));
  }

  // 👉 Obtener una cita por ID
  @UseGuards(JwtAuthGuard)
  @Get(':id')
  getOne(@Param('id') id: number) {
    return this.service.findOne(Number(id));
  }

  // 👉 Cambiar estado de cita (confirmar, cancelar, etc.)
  @UseGuards(JwtAuthGuard)
  @Patch(':id/estado')
  updateEstado(@Param('id') id: number, @Body('estado') estado: string) {
    return this.service.updateEstado(Number(id), estado);
  }

  // 👉 Eliminar cita
  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  delete(@Param('id') id: number) {
    return this.service.remove(Number(id));
  }
  @Get("barbershop/:id")
  async getByBarbershop(@Param("id") id: string) {
  return this.service.findByBarbershop(Number(id));
}

}
