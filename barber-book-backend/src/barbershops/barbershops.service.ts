import { Injectable } from '@nestjs/common';
import { CreateBarbershopDto } from './dto/create-barbershop.dto';
import { UpdateBarbershopDto } from './dto/update-barbershop.dto';

@Injectable()
export class BarbershopsService {
  create(createBarbershopDto: CreateBarbershopDto) {
    return 'This action adds a new barbershop';
  }

  findAll() {
    return `This action returns all barbershops`;
  }

  findOne(id: number) {
    return `This action returns a #${id} barbershop`;
  }

  update(id: number, updateBarbershopDto: UpdateBarbershopDto) {
    return `This action updates a #${id} barbershop`;
  }

  remove(id: number) {
    return `This action removes a #${id} barbershop`;
  }
}
