import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, OneToOne } from "typeorm";
import { User } from "src/users/user.entity";
import { Barber } from "src/barbers/barber.entity";
import { Barbershop } from "src/barbershops/barbershop.entity";
import { Appointment } from "src/appointments/appointment.entity";

@Entity("reseñas")
export class Review {
  @PrimaryGeneratedColumn({ name: "id_resena" })
  id: number;

  // ⭐ BARBERO
  @Column({ name: "calificacion_barbero", type: "int" })
  calificacionBarbero: number;

  @Column({ name: "comentario_barbero", type: "text", nullable: true })
  comentarioBarbero: string | null;

  // ⭐ BARBERÍA
  @Column({ name: "calificacion_barberia", type: "int" })
  calificacionBarberia: number;

  @Column({ name: "comentario_barberia", type: "text", nullable: true })
  comentarioBarberia: string | null;

  @Column({ type: "timestamp", default: () => "now()" })
  fecha: Date;

  @ManyToOne(() => User)
  @JoinColumn({ name: "id_cliente" })
  cliente: User;

  @ManyToOne(() => Barber)
  @JoinColumn({ name: "id_barbero" })
  barbero: Barber;

  @ManyToOne(() => Barbershop)
  @JoinColumn({ name: "id_barberia" })
  barberia: Barbershop;

  @OneToOne(() => Appointment)
  @JoinColumn({ name: "id_cita" })
  cita: Appointment;
}

