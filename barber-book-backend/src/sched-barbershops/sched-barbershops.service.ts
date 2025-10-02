import { Injectable } from '@nestjs/common';
import { CreateSchedBarbershopDto } from './dto/create-sched-barbershop.dto';
import { UpdateSchedBarbershopDto } from './dto/update-sched-barbershop.dto';

@Injectable()
export class SchedBarbershopsService {
  create(createSchedBarbershopDto: CreateSchedBarbershopDto) {
    return 'This action adds a new schedBarbershop';
  }

  findAll() {
    return `This action returns all schedBarbershops`;
  }

  findOne(id: number) {
    return `This action returns a #${id} schedBarbershop`;
  }

  update(id: number, updateSchedBarbershopDto: UpdateSchedBarbershopDto) {
    return `This action updates a #${id} schedBarbershop`;
  }

  remove(id: number) {
    return `This action removes a #${id} schedBarbershop`;
  }
}
