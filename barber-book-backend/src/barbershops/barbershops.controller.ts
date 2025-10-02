import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { BarbershopsService } from './barbershops.service';
import { CreateBarbershopDto } from './dto/create-barbershop.dto';
import { UpdateBarbershopDto } from './dto/update-barbershop.dto';

@Controller('barbershops')
export class BarbershopsController {
  constructor(private readonly barbershopsService: BarbershopsService) {}

  @Post()
  create(@Body() createBarbershopDto: CreateBarbershopDto) {
    return this.barbershopsService.create(createBarbershopDto);
  }

  @Get()
  findAll() {
    return this.barbershopsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.barbershopsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateBarbershopDto: UpdateBarbershopDto) {
    return this.barbershopsService.update(+id, updateBarbershopDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.barbershopsService.remove(+id);
  }
}
