import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Review } from "./review.entity";
import { ReviewsController } from "./reviews.controller";
import { ReviewsService } from "./reviews.service";
import { User } from "src/users/user.entity";
import { Barber } from "src/barbers/barber.entity";
import { Barbershop } from "src/barbershops/barbershop.entity";
import { Appointment } from "src/appointments/appointment.entity";

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Review,
      User,
      Barber,
      Barbershop,
      Appointment, // 👈 ESTA LÍNEA ES LA CLAVE
    ]),
  ],
  controllers: [ReviewsController],
  providers: [ReviewsService],
  exports: [ReviewsService],
})
export class ReviewsModule {}
