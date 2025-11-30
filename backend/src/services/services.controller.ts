import { Controller, Get, Post, Body, Param, Patch, Delete } from "@nestjs/common";
import { ServicesService } from "./services.service";
import { CreateServiceDto } from "./dto/create-service.dto";
import { UpdateServiceDto } from "./dto/update-service.dto";

@Controller("services")
export class ServicesController {
  constructor(private service: ServicesService) {}

  @Get()
  findAll() {
    return this.service.findAll();
  }

  @Get("barbershop/:id")
  findByBarbershop(@Param("id") id: string) {
    return this.service.findByBarbershop(Number(id));
  }

  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.service.findOne(Number(id));
  }

  @Post()
  create(@Body() body: CreateServiceDto) {
    return this.service.create(body);
  }

  @Patch(":id")
  update(@Param("id") id: string, @Body() body: UpdateServiceDto) {
    return this.service.update(Number(id), body);
  }

  @Delete(":id")
  remove(@Param("id") id: string) {
    return this.service.remove(Number(id));
  }
}
