import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, OneToMany } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Barber } from '../../barbers/entities/barber.entity';

@Entity('barbershops')
export class Barbershop {
    @PrimaryGeneratedColumn({ name: 'id_barbershop' })
    id: number;

    @Column()
    name: string;

    @Column()
    address: string;

    @Column({ name: 'owner_id' })
    ownerId: number;

    @Column({ type: 'jsonb', nullable: true, name: 'global-schedules' })
    globalSchedules: any;

    @CreateDateColumn({ name: 'creation-date' })
    creationDate: Date;

/*    @ManyToOne(() => User, user => user.id)
    owner: User;

    @OneToMany(() => Barber, barber => barber.barbershopId)
    barbers: Barber[];*/
}