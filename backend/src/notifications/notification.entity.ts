import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { User } from 'src/users/user.entity';

@Entity('notificaciones')
export class Notification {
  @PrimaryGeneratedColumn({ name: 'id_notificacion' })
  id: number;

  @Column()
  mensaje: string;

  @Column()
  tipo: string;

  @Column({ default: 'pendiente' })
  estado: string;

  @Column({ name: 'fecha_envio', type: 'timestamp', default: () => 'now()' })
  fechaEnvio: Date;

  @ManyToOne(() => User, (user) => user.notificaciones)
  @JoinColumn({ name: 'id_usuario' })
  usuario: User;
}
