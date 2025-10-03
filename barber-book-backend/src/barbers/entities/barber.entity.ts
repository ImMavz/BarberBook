import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
//  Mantén comentadas las relaciones por ahora
// import { User } from '../../users/entities/user.entity';
// import { Barbershop } from '../../barbershops/entities/barbershop.entity';

@Entity('barberos')
export class Barber {
    @PrimaryGeneratedColumn({ name: 'id_barbero' })
    id: number;

    @Column({ name: 'id_usuario' })
    usuarioId: number;

    @Column({ name: 'id_barberia' })
    barberiaId: number;

    @Column({ name: 'foto_perfil', nullable: true })
    fotoPerfil: string;

    @Column({ nullable: true })
    descripcion: string;

    @Column({ nullable: true })
    experiencia: number;

    // ️ Mantén comentadas las relaciones por ahora
    /*
    @OneToOne(() => User, user => user.barber)
    @JoinColumn({ name: 'id_usuario' })
    usuario: User;

    @ManyToOne(() => Barbershop, barbershop => barbershop.barberos)
    @JoinColumn({ name: 'id_barberia' })
    barberia: Barbershop;
    */
}