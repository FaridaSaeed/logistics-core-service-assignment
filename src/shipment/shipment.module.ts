import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Shipment } from './shipment.entity';
import { ShipmentService } from './shipment.service';
import { ShipmentController } from './shipment.controller';
import { Status } from '../status/status.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Shipment, Status])],
  providers: [ShipmentService],
  controllers: [ShipmentController],
})
export class ShipmentModule {}
