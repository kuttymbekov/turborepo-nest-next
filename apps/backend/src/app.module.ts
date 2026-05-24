import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';
import { WorkTypesModule } from './work-types/work-types.module';
import { WorkEntriesModule } from './work-entries/work-entries.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    WorkTypesModule,
    WorkEntriesModule,
  ],
})
export class AppModule {}
