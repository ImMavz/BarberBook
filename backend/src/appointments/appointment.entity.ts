import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { User } from 'src/users/user.entity';
import { Barber } from 'src/barbers/barber.entity';
import { Service } from 'src/services/service.entity';

@Entity('citas')
export class Appointment {
  @PrimaryGeneratedColumn({ name: 'id_cita' })
  id: number;

  @Column({ type: 'date' })
  fecha: Date;

  @Column({ name: 'hora_inicio', type: 'time' })
  horaInicio: string;

  @Column({ name: 'hora_fin', type: 'time' })
  horaFin: string;

  @Column({ default: 'pendiente' })
  estado: string;

  @Column({ name: 'fecha_creacion', type: 'timestamp', default: () => 'now()' })
  fechaCreacion: Date;

  // Cliente
  @ManyToOne(() => User, (user) => user.citas)
  @JoinColumn({ name: 'id_cliente' })
  cliente: User;

  // Barbero
  @ManyToOne(() => Barber, (barber) => barber.citas)
  @JoinColumn({ name: 'id_barbero' })
  barbero: Barber;

  // Servicio
  @ManyToOne(() => Service)
  @JoinColumn({ name: 'id_servicio' })
  servicio: Service;
}
