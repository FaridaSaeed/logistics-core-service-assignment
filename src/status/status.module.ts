import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StatusService } from './status.service';
import { StatusController } from './status.controller';
import { Status } from './status.entity';

/**
 * Module encapsulating status entity, controller, and service.
 * StatusService seeds default statuses on startup.
 */
@Module({
  imports: [TypeOrmModule.forFeature([Status])],
  providers: [StatusService],
  controllers: [StatusController],
  exports: [StatusService],
})
export class StatusModule {}
