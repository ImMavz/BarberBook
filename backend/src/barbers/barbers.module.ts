import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Barber } from "./barber.entity";
import { BarbersController } from "./barbers.controller";
import { BarbersService } from "./barbers.service";
import { User } from "src/users/user.entity";
import { Barbershop } from "src/barbershops/barbershop.entity";

@Module({
  imports: [TypeOrmModule.forFeature([Barber, User, Barbershop])],
  controllers: [BarbersController],
  providers: [BarbersService],
  exports: [BarbersService],
})
export class BarbersModule {}
