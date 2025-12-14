import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Barbershop } from "./barbershop.entity";
import { BarbershopsController } from "./barbershops.controller";
import { BarbershopsService } from "./barbershops.service";
import { User } from "src/users/user.entity";
//comentario
@Module({
  imports: [TypeOrmModule.forFeature([Barbershop, User])],
  controllers: [BarbershopsController],
  providers: [BarbershopsService],
  exports: [BarbershopsService],
})
export class BarbershopsModule {}