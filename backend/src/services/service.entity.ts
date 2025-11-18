import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Barbershop } from 'src/barbershops/barbershop.entity';

@Entity('servicios')
export class Service {
  @PrimaryGeneratedColumn({ name: 'id_servicio' })
  id: number;

  @Column()
  nombre: string;

  @Column({ type: 'numeric' })
  precio: number;

  @Column()
  duracion: number; // minutos

  @ManyToOne(() => Barbershop, (barbershop) => barbershop.servicios)
  @JoinColumn({ name: 'id_barberia' })
  barberia: Barbershop;
}
