import { ApiProperty } from '@nestjs/swagger';
import { StatusDto } from '../../status/dto/status.dto';

// DTO to structure outgoing data (used if returning custom response shapes)
export class ShipmentDto {
  @ApiProperty({ description: 'Unique identifier for the shipment' })
  id: string;

  @ApiProperty({ description: 'Tracking identifier' })
  trackingId: string;

  @ApiProperty({ description: 'Phone number of the recipient' })
  phoneNumber: string;

  @ApiProperty({ description: 'Optional shipment description', nullable: true })
  description: string | null;

  @ApiProperty({
    description: 'Current status of the shipment',
    type: StatusDto,
  })
  status: StatusDto;

  @ApiProperty({ description: 'Date when the shipment was created' })
  creationDate: Date;

  @ApiProperty({ description: 'Date when the shipment was last modified' })
  modificationDate: Date;
}