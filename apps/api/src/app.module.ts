import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { PrismaModule } from './prisma/prisma.module'
import { AuthModule } from './modules/auth/auth.module'
import { UsersModule } from './modules/users/users.module'
import { FleetsModule } from './modules/fleets/fleets.module'
import { VehiclesModule } from './modules/vehicles/vehicles.module'
import { JobsModule } from './modules/jobs/jobs.module'
import { MechanicsModule } from './modules/mechanics/mechanics.module'
import { RunnersModule } from './modules/runners/runners.module'
import { PartsModule } from './modules/parts/parts.module'
import { HealthModule } from './modules/health/health.module'

@Module({
  imports: [
    // Configuration
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '../../.env',
    }),

    // Database
    PrismaModule,

    // Feature modules
    HealthModule,
    AuthModule,
    UsersModule,
    FleetsModule,
    VehiclesModule,
    JobsModule,
    MechanicsModule,
    RunnersModule,
    PartsModule,
  ],
})
export class AppModule {}
