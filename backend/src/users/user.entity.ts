import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Barbershop } from 'src/barbershops/barbershop.entity';
import { Review } from 'src/reviews/review.entity';
import { Appointment } from 'src/appointments/appointment.entity';
import { Notification } from 'src/notifications/notification.entity';

@Entity('usuarios')
export class User {
  @PrimaryGeneratedColumn({ name: 'id_usuario' })
  id: number;

  @Column({ name: 'nombre' })
  nombre: string;

  @Column({ name: 'correo' })
  correo: string;

  @Column({ name: 'contraseña' })
  contraseña: string;

  @Column({ name: 'rol' })
  rol: string;

  @Column({ name: 'fecha_registro', type: 'timestamp', default: () => 'now()' })
  fechaRegistro: Date;

  // Relaciones
  @OneToMany(() => Barbershop, (barbershop) => barbershop.dueño)
  barberias: Barbershop[];

  @OneToMany(() => Review, (review) => review.cliente)
  reseñas: Review[];

  @OneToMany(() => Appointment, (appointment) => appointment.cliente)
  citas: Appointment[];

  @OneToMany(() => Notification, (notification) => notification.usuario)
  notificaciones: Notification[];
}
