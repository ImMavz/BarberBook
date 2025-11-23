import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './users/users.module';
import { BarbershopsModule } from './barbershops/barbershops.module';
import { BarbersModule } from './barbers/barbers.module';
import { ServicesModule } from './services/services.module';
import { SchedulesModule } from './schedules/schedules.module';
import { AppointmentsModule } from './appointments/appointments.module';
import { NotificationsModule } from './notifications/notifications.module';
import { PaymentsModule } from './payments/payments.module';
import { ReviewsModule } from './reviews/reviews.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),

    TypeOrmModule.forRoot({
      type: 'postgres',
      url: process.env.DATABASE_URL,
      autoLoadEntities: true, // carga todas las entidades sin necesidad de importarlas
      synchronize: false, // en producción debe ser false
      ssl: {
        rejectUnauthorized: false, // necesario para Supabase
      },
    }),

    UsersModule,

    BarbershopsModule,

    BarbersModule,

    ServicesModule,

    SchedulesModule,

    AppointmentsModule,

    NotificationsModule,

    PaymentsModule,

    ReviewsModule,
  ],
})
export class AppModule {}
