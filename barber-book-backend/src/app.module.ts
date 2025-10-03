import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { BarbersModule } from './barbers/barbers.module';
import { UsersModule } from './users/users.module';
import { BarbershopsModule } from './barbershops/barbershops.module';
import { AppointmentsModule } from './appointments/appointments.module';
import { PaymentsModule } from './payments/payments.module';
import { SchedBarbershopsModule } from './sched-barbershops/sched-barbershops.module';
import { ReviewsModule } from './reviews/reviews.module';
import { NotificationsModule } from './notifications/notifications.module';
import { ServicesModule } from './services/services.module';

@Module({
    imports: [
        // ConfigModule: Carga las variables del .env de forma global
        ConfigModule.forRoot({
            isGlobal: true,
        }),

        // TypeOrmModule: Configuración asíncrona usando las variables de entorno
        TypeOrmModule.forRootAsync({
            imports: [ConfigModule],
            useFactory: (configService: ConfigService) => ({
                type: configService.get<any>('DB_TYPE'), // 'postgres'
                host: configService.get<string>('DB_HOST'), // Host del Pooler (aws-1-us-east-1.pooler.supabase.com)
                port: configService.get<number>('DB_PORT'), // Puerto del Pooler (6543)
                username: configService.get<string>('DB_USERNAME'), // Nombre de usuario completo
                password: configService.get<string>('DB_PASSWORD'),
                database: configService.get<string>('DB_DATABASE'),

                // Carga automáticamente todas las entidades definidas en los módulos
                autoLoadEntities: true,

                // ¡Cuidado! Solo para desarrollo. Sincroniza el esquema con las entidades.
                synchronize: configService.get<boolean>('DB_SYNCHRONIZE'),
            }),
            inject: [ConfigService],
        }),

        // Módulos de la aplicación
        BarbersModule,
        UsersModule,
        BarbershopsModule, AppointmentsModule, PaymentsModule, SchedBarbershopsModule, ReviewsModule, NotificationsModule, ServicesModule
    ],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule {}
