import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Review } from "./review.entity";
import { ReviewsController } from "./reviews.controller";
import { ReviewsService } from "./reviews.service";
import { User } from "src/users/user.entity";
import { Barber } from "src/barbers/barber.entity";
import { Barbershop } from "src/barbershops/barbershop.entity";

@Module({
  imports: [TypeOrmModule.forFeature([Review, User, Barber, Barbershop])],
  controllers: [ReviewsController],
  providers: [ReviewsService],
  exports: [ReviewsService],
})
export class ReviewsModule {}
