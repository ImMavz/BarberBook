import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, OneToOne } from 'typeorm';

@Entity('usuarios')
export class User {
    @PrimaryGeneratedColumn({ name: 'id_usuario' })
    id: number;

    @Column({ name: 'nombre' })
    nombre: string;

    @Column({ name: 'correo' })
    correo: string;

    @Column({ name: 'contraseña' })
    contraseña: string;

    @Column({ name: 'rol' })
    rol: string; // 'client', 'barber', 'owner' (del enum)

    @CreateDateColumn({ name: 'fecha_registro' })
    fechaRegistro: Date;

/*
    @OneToOne(() => Barber, barber => barber.userId)
    barber: Barber;
*/
}