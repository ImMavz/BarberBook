import { Controller, Get, Post, Body, Param, UseGuards, Request } from "@nestjs/common";
import { ReviewsService } from "./reviews.service";
import { CreateReviewDto } from "./dto/create-review.dto";
import { JwtAuthGuard } from "src/auth/jwt-auth.guard";

@Controller("reviews")
export class ReviewsController {
  constructor(private service: ReviewsService) {}

  // ⭐ Crear reseña (cliente logueado)
  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Request() req, @Body() dto: CreateReviewDto) {
    return this.service.create(dto, req.user.id);
  }

  // ⭐ Reseñas de barbería
  @Get("barberia/:id")
  findByBarberia(@Param("id") id: number) {
    return this.service.findByBarberia(Number(id));
  }

  // ⭐ Reseñas de barbero
  @Get("barbero/:id")
  findByBarbero(@Param("id") id: number) {
    return this.service.findByBarbero(Number(id));
  }

  // ⭐ Promedios
  @Get("barbero/:id/promedio")
  promedioBarbero(@Param("id") id: number) {
    return this.service.promedioBarbero(Number(id));
  }

  @Get("barberia/:id/promedio")
  promedioBarberia(@Param("id") id: number) {
    return this.service.promedioBarberia(Number(id));
  }
}
