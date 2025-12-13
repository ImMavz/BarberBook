import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Patch,
  Delete,
  Query,
  UseGuards,
  Req,
} from "@nestjs/common";
import { BarbershopsService } from "./barbershops.service";
import { CreateBarbershopDto } from "./dto/create-barbershop.dto";
import { UpdateBarbershopDto } from "./dto/update-barbershop.dto";
import { JwtAuthGuard } from "../auth/jwt-auth.guard";

@Controller("barbershops")
export class BarbershopsController {
  constructor(private service: BarbershopsService) {}

  @Get()
  findAll() {
    return this.service.findAll();
  }

  // 🔐 Barberías del dueño autenticado
  @UseGuards(JwtAuthGuard)
  @Get("mine")
  findMine(@Req() req) {
    const dueñoId = req.user.sub;
    return this.service.findByOwner(dueñoId);
  }

  // Filtro
  @Get("filter")
  filter(@Query() query: any) {
    return this.service.filter(query);
  }

  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.service.findOne(Number(id));
  }

  @Post()
  create(@Body() body: CreateBarbershopDto) {
    return this.service.create(body);
  }

  @Patch(":id")
  update(@Param("id") id: string, @Body() body: UpdateBarbershopDto) {
    return this.service.update(Number(id), body);
  }

  @Delete(":id")
  delete(@Param("id") id: string) {
    return this.service.remove(Number(id));
  }
}
