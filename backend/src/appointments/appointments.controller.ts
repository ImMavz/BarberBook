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
  BadRequestException,
} from "@nestjs/common";
import { JwtAuthGuard } from "src/auth/jwt-auth.guard";
import { AppointmentsService } from "./appointments.service";
import { CreateAppointmentDto } from "./dto/create-appointment.dto";

@Controller("appointments")
export class AppointmentsController {
  constructor(private readonly service: AppointmentsService) {}

  // ==========================================
  // 📌 CREAR CITA (CLIENTE LOGUEADO)
  // ==========================================
  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Request() req, @Body() dto: CreateAppointmentDto) {
    const clienteId = req.user.id;
    return this.service.create({ ...dto, clienteId });
  }

  // ==========================================
  // 📌 CITAS DE UN CLIENTE
  // ==========================================
  @UseGuards(JwtAuthGuard)
  @Get("cliente")
  getByCliente(@Request() req) {
    const clienteId = req.user.id;
    return this.service.findByCliente(clienteId);
  }

  // ==========================================
  // 📌 CITAS DE UN BARBERO
  // ==========================================
  @UseGuards(JwtAuthGuard)
  @Get("barbero/:id")
  getByBarbero(@Param("id") id: string) {
    return this.service.findByBarbero(Number(id));
  }

  // ==========================================
  // 📌 CITAS POR BARBERÍA
  // ==========================================
  @UseGuards(JwtAuthGuard)
  @Get("barbershop/:id")
  getByBarbershop(@Param("id") id: string) {
    return this.service.findByBarbershop(Number(id));
  }

  // ==========================================
  // 📌 OBTENER CITA POR ID
  // ==========================================
  @UseGuards(JwtAuthGuard)
  @Get(":id")
  getOne(@Param("id") id: string) {
    return this.service.findOne(Number(id));
  }

  // ==========================================
  // 📌 CAMBIAR ESTADO DE LA CITA
  // ==========================================
  @UseGuards(JwtAuthGuard)
  @Patch(":id")
  updateEstado(
    @Param("id") id: string,
    @Body("estado") estado: string
  ) {
    if (!["pendiente", "en progreso", "completado"].includes(estado)) {
      throw new BadRequestException("Estado inválido");
    }

    return this.service.updateEstado(Number(id), estado);
  }

  // ==========================================
  // 📌 ELIMINAR CITA
  // ==========================================
  @UseGuards(JwtAuthGuard)
  @Delete(":id")
  remove(@Param("id") id: string) {
    return this.service.remove(Number(id));
  }
}
