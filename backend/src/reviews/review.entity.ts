import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { User } from 'src/users/user.entity';
import { Barber } from 'src/barbers/barber.entity';
import { Barbershop } from 'src/barbershops/barbershop.entity';

@Entity('reseñas')
export class Review {
  @PrimaryGeneratedColumn({ name: 'id_resena' })
  id: number;

  @Column()
  calificacion: number;

  @Column({ type: 'text', nullable: true })   // <<< CAMBIO CLAVE
  comentario: string | null;

  @Column({ type: 'timestamp', default: () => 'now()' })
  fecha: Date;

  @ManyToOne(() => User, (user) => user.reseñas)
  @JoinColumn({ name: 'id_cliente' })
  cliente: User;

  @ManyToOne(() => Barber, (barber) => barber.citas, { nullable: true })
  @JoinColumn({ name: 'id_barbero' })
  barbero: Barber | null;

  @ManyToOne(() => Barbershop, (barbershop) => barbershop.reseñas, { nullable: true })
  @JoinColumn({ name: 'id_barberia' })
  barberia: Barbershop | null;
}
