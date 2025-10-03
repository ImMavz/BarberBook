import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { SchedBarbershopsService } from './sched-barbershops.service';
import { CreateSchedBarbershopDto } from './dto/create-sched-barbershop.dto';
import { UpdateSchedBarbershopDto } from './dto/update-sched-barbershop.dto';

@Controller('sched-barbershops')
export class SchedBarbershopsController {
  constructor(private readonly schedBarbershopsService: SchedBarbershopsService) {}

  @Post()
  create(@Body() createSchedBarbershopDto: CreateSchedBarbershopDto) {
    return this.schedBarbershopsService.create(createSchedBarbershopDto);
  }

  @Get()
  findAll() {
    return this.schedBarbershopsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.schedBarbershopsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateSchedBarbershopDto: UpdateSchedBarbershopDto) {
    return this.schedBarbershopsService.update(+id, updateSchedBarbershopDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.schedBarbershopsService.remove(+id);
  }
}
