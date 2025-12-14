import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, JoinColumn } from 'typeorm';
import { User } from 'src/users/user.entity';
import { Barber } from 'src/barbers/barber.entity';
import { Service } from 'src/services/service.entity';
import { Review } from 'src/reviews/review.entity';
//Comentario
@Entity('barberias')
export class Barbershop {
  @PrimaryGeneratedColumn({ name: 'id_barberia' })
  id: number;

  @Column()
  nombre: string;

  @Column()
  direccion: string;

  @Column({ name: 'horarios_globales', type: 'jsonb', nullable: true })
  horariosGlobales: any;

  @Column({ name: 'fecha_creacion', type: 'timestamp', default: () => 'now()' })
  fechaCreacion: Date;

  // Dueño (User)
  @ManyToOne(() => User, (user) => user.barberias)
  @JoinColumn({ name: 'dueño_id' })
  dueño: User;

  // Relaciones
  @OneToMany(() => Barber, (barber) => barber.barberia)
  barberos: Barber[];

  @OneToMany(() => Service, (service) => service.barberia)
  servicios: Service[];

  @OneToMany(() => Review, (review) => review.barberia)
  reseñas: Review[];
}
