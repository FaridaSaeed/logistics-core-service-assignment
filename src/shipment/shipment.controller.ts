import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Patch,
} from '@nestjs/common';
import { ShipmentService } from './shipment.service';
import { CreateShipmentDto } from './dto/create-shipment.dto';
import { ShipmentDto } from './dto/shipment.dto';
import { ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';

@Controller('shipments')
@ApiTags('Shipments')
export class ShipmentController {
  constructor(private readonly shipmentService: ShipmentService) {}

  // Maps Shipment entity to ShipmentDto
  private toDto(entity): ShipmentDto {
    const { id, trackingId, phoneNumber, description, status, creationDate, modificationDate } = entity;
    return {
      id,
      trackingId,
      phoneNumber,
      description,
      status: {
        id: status.id,
        name: status.name,
      },
      creationDate,
      modificationDate,
    };
  }

  @Post()
  async create(@Body() dto: CreateShipmentDto): Promise<ShipmentDto> {
    const shipment = await this.shipmentService.create(dto);
    return this.toDto(shipment);
  }

  @Get()
  async findAll(): Promise<ShipmentDto[]> {
    const shipments = await this.shipmentService.findAll();
    return shipments.map((s) => this.toDto(s));
  }

  @Patch(':id/checkout')
  async checkout(@Param('id') id: string): Promise<ShipmentDto> {
    const shipment = await this.shipmentService.checkout(id);
    return this.toDto(shipment);
  }

  @Patch(':id/deliver')
  async deliver(@Param('id') id: string): Promise<ShipmentDto> {
    const shipment = await this.shipmentService.deliver(id);
    return this.toDto(shipment);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a shipment by ID' })
  @ApiParam({ name: 'id', type: 'string', description: 'UUID of the shipment' })
  @ApiResponse({ status: 200, description: 'Shipment deleted successfully' })
  @ApiResponse({ status: 404, description: 'Shipment not found' })
  async remove(@Param('id') id: string): Promise<{ message: string }> {
    return this.shipmentService.remove(id);
  }
}
