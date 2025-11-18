import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Barber } from 'src/barbers/barber.entity';

@Entity('pagos')
export class Payment {
  @PrimaryGeneratedColumn({ name: 'id_pago' })
  id: number;

  @Column({ type: 'numeric' })
  monto: number;

  @Column({ name: 'fecha_pago', type: 'timestamp', default: () => 'now()' })
  fechaPago: Date;

  @Column()
  estado: string;

  @Column({ nullable: true })
  metodo: string;

  @ManyToOne(() => Barber, (barber) => barber.pagos)
  @JoinColumn({ name: 'id_barbero' })
  barbero: Barber;
}
