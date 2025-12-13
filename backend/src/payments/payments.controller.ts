import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Patch,
  Delete,
} from "@nestjs/common";
import { PaymentsService } from "./payments.service";
import { CreatePaymentDto } from "./dto/create-payment.dto";
import { UpdatePaymentDto } from "./dto/update-payment.dto";

@Controller("payments")
export class PaymentsController {
  constructor(private service: PaymentsService) { }

  @Get()
  findAll() {
    return this.service.findAll();
  }

  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.service.findOne(Number(id));
  }

  @Post()
  create(@Body() body: CreatePaymentDto) {
    return this.service.create(body);
  }

  // ➤ Endpoint para crear preferencia de MercadoPago
  @Post("preference")
  async createPreference(
    @Body() body: { title: string; quantity: number; price: number }
  ) {
    return this.service.createPreference(body.title, body.quantity, body.price);
  }

  @Patch(":id")
  update(@Param("id") id: string, @Body() body: UpdatePaymentDto) {
    return this.service.update(Number(id), body);
  }

  @Delete(":id")
  delete(@Param("id") id: string) {
    return this.service.remove(Number(id));
  }
}
