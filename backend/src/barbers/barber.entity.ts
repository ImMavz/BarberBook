import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, JoinColumn } from 'typeorm';
import { User } from 'src/users/user.entity';
import { Barbershop } from 'src/barbershops/barbershop.entity';
import { Appointment } from 'src/appointments/appointment.entity';
import { Schedule } from 'src/schedules/schedule.entity';
import { Payment } from 'src/payments/payment.entity';
import { Review } from 'src/reviews/review.entity';

@Entity('barberos')
export class Barber {
  @PrimaryGeneratedColumn({ name: 'id_barbero' })
  id: number;

  @Column({ name: 'experiencia', nullable: true })
  experiencia: number;

  @Column({ name: 'foto_perfil', nullable: true })
  fotoPerfil: string;

  @Column({ nullable: true })
  descripcion: string;

  // FK usuario
  @ManyToOne(() => User)
  @JoinColumn({ name: 'id_usuario' })
  usuario: User;

  // FK barbería
  @ManyToOne(() => Barbershop, (barbershop) => barbershop.barberos)
  @JoinColumn({ name: 'id_barberia' })
  barberia: Barbershop;

  @OneToMany(() => Schedule, (schedule) => schedule.barbero)
  horarios: Schedule[];

  @OneToMany(() => Appointment, (appt) => appt.barbero)
  citas: Appointment[];

  @OneToMany(() => Payment, (pay) => pay.barbero)
  pagos: Payment[];

  @OneToMany(() => Review, (review) => review.barbero)
  resenas: Review[];

}
