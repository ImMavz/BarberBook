import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Req,
  Patch,
  Delete,
  UseGuards,
} from "@nestjs/common";
import { BarbersService } from "./barbers.service";
import { CreateBarberDto } from "./dto/create-barber.dto";
import { UpdateBarberDto } from "./dto/update-barber.dto";
import { JwtAuthGuard } from "src/auth/jwt-auth.guard";

@Controller("barbers")
export class BarbersController {
  constructor(private readonly service: BarbersService) {}

  // ======================
  // 🔹 Obtener todos
  // ======================
  @Get()
  findAll() {
    return this.service.findAll();
  }

  // ======================
  // 🔹 Perfil del barbero logeado
  // ======================
  @UseGuards(JwtAuthGuard)
  @Get("me")
  async getProfile(@Req() req) {
    const idUsuario = req.user.id; // viene del JWT
    return this.service.findByUserId(idUsuario);
  }

  // ======================
  // 🔹 Obtener uno por ID
  // ======================
  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.service.findOne(Number(id));
  }

  @Get("barbershop/:id")
  findByBarbershop(@Param("id") id: string) {
    return this.service.findByBarbershop(Number(id));
  }


  // ======================
  // 🔹 Crear barbero
  // ======================
  @Post()
  create(@Body() body: CreateBarberDto) {
    return this.service.create(body);
  }

  // ======================
  // 🔹 Actualizar barbero
  // ======================
  @Patch(":id")
  update(@Param("id") id: string, @Body() body: UpdateBarberDto) {
    return this.service.update(Number(id), body);
  }

  // ======================
  // 🔹 Eliminar barbero
  // ======================
  @Delete(":id")
  delete(@Param("id") id: string) {
    return this.service.remove(Number(id));
  }
}
