import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import * as Joi from 'joi';
import { SequelizeModule } from '@nestjs/sequelize';
import { UsersModule } from './users/users.module';
import { AdminsModule } from './admins/admins.module';
import { NewsModule } from './news/news.module';
import { WorkersModule } from './workers/workers.module';
import { CitiesModule } from './cities/cities.module';
import { CompaniesModule } from './companies/companies.module';
import { ReviewsModule } from './reviews/reviews.module';
import { HotelsModule } from './hotels/hotels.module';
import { HotelBookingsModule } from './hotel-bookings/hotel-bookings.module';
import { AirportsModule } from './airports/airports.module';
import { LoyaltyProgramsModule } from './loyalty-programs/loyalty-programs.module';
import { PlanesModule } from './planes/planes.module';
import { TicketsModule } from './tickets/tickets.module';
import { FlightsModule } from './flights/flights.module';
import { SeatsModule } from './seats/seats.module';
import { CarsModule } from './cars/cars.module';
import { CarRentalsModule } from './car-rentals/car-rentals.module';
import { ClassesModule } from './classes/classes.module';
import { CountriesModule } from './countries/countries.module';
import { AuthModule } from './auth/auth.module';
import { TransactionsModule } from './transactions/transactions.module';
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
      validationSchema: Joi.object({
        NODE_ENV: Joi.string().valid('development', 'test', 'production').default('development'),
        PORT: Joi.number().default(3000),
        DB_HOST: Joi.string().required(),
        DB_PORT: Joi.number().required(),
        DB_USER: Joi.string().required(),
        DB_PASS: Joi.string().required(),
        DB_NAME: Joi.string().required(),
        JWT_SECRET: Joi.when('NODE_ENV', {
          is: 'production',
          then: Joi.string().min(32).required(),
          otherwise: Joi.string().min(1).default('dev_secret_change_me_please_use_strong_secret')
        }),
        JWT_REFRESH_SECRET: Joi.when('NODE_ENV', {
          is: 'production',
          then: Joi.string().min(32).required(),
          otherwise: Joi.string().allow('').optional(),
        }),
        JWT_ACCESS_EXPIRES: Joi.number().positive().default(1),
        JWT_REFRESH_EXPIRES: Joi.number().positive().default(30),
        PASSWORD_SALT_ROUNDS: Joi.number().positive().default(10),
      }),
    }),
    SequelizeModule.forRoot({
      dialect: 'postgres',
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT),
      username: process.env.DB_USER,
      password: process.env.DB_PASS,
      database: process.env.DB_NAME,
      logging: false,
      synchronize:true,
      autoLoadModels: true,
    }),
    UsersModule,
    AdminsModule,
    NewsModule,
    WorkersModule,
    CitiesModule,
    CompaniesModule,
    ReviewsModule,
    HotelsModule,
    HotelBookingsModule,
    AirportsModule,
    LoyaltyProgramsModule,
    PlanesModule,
    TicketsModule,
    FlightsModule,
    SeatsModule,
    CarsModule,
    CarRentalsModule,
    ClassesModule,
    CountriesModule,
    AuthModule,
    TransactionsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
