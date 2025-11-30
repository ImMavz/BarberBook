import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Notification } from "./notification.entity";
import { CreateNotificationDto } from "./dto/create-notification.dto";
import { UpdateNotificationDto } from "./dto/update-notification.dto";
import { User } from "src/users/user.entity";

@Injectable()
export class NotificationsService {
  constructor(
    @InjectRepository(Notification)
    private repo: Repository<Notification>,

    @InjectRepository(User)
    private usersRepo: Repository<User>,
  ) {}

  async findAll() {
    return this.repo.find({
      relations: ["usuario"],
    });
  }

  async findOne(id: number) {
    const notif = await this.repo.findOne({
      where: { id },
      relations: ["usuario"],
    });

    if (!notif) throw new NotFoundException("Notificación no encontrada");
    return notif;
  }

  async create(dto: CreateNotificationDto) {
    const usuario = await this.usersRepo.findOne({
      where: { id: dto.usuarioId },
    });

    if (!usuario) throw new NotFoundException("Usuario no encontrado");

    const notification = this.repo.create({
      mensaje: dto.mensaje,
      tipo: dto.tipo,
      usuario,
    });

    return this.repo.save(notification);
  }

  async update(id: number, dto: UpdateNotificationDto) {
    const notif = await this.findOne(id);

    Object.assign(notif, dto);

    return this.repo.save(notif);
  }

  async remove(id: number) {
    const notif = await this.findOne(id);
    return this.repo.remove(notif);
  }
}
