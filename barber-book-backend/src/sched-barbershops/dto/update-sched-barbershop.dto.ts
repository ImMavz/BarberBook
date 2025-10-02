import { PartialType } from '@nestjs/mapped-types';
import { CreateSchedBarbershopDto } from './create-sched-barbershop.dto';

export class UpdateSchedBarbershopDto extends PartialType(CreateSchedBarbershopDto) {}
