import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Barber } from 'src/barbers/barber.entity';

@Entity('horarios_barberos')
export class Schedule {
  @PrimaryGeneratedColumn({ name: 'id_horario' })
  id: number;

  @Column({ name: 'dia_semana' })
  diaSemana: string;

  @Column({ name: 'hora_inicio', type: 'time' })
  horaInicio: string;

  @Column({ name: 'hora_fin', type: 'time' })
  horaFin: string;

  @Column({ default: true })
  disponible: boolean;

  @ManyToOne(() => Barber, (barber) => barber.horarios)
  @JoinColumn({ name: 'id_barbero' })
  barbero: Barber;
}
