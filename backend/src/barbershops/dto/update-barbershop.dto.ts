import { PartialType } from "@nestjs/mapped-types";
import { CreateBarbershopDto } from "./create-barbershop.dto";
//Comentario
export class UpdateBarbershopDto extends PartialType(CreateBarbershopDto) {}
