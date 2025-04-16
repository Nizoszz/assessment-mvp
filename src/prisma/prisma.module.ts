import { Module } from '@nestjs/common';
import { ConfigModule } from '../config/config.module';
import { PrismaService } from './prisma.service';

@Module({
  imports: [ConfigModule.forRoot()],
  providers: [PrismaService],
  exports: [PrismaService],
})
export class PrismaModule {}
