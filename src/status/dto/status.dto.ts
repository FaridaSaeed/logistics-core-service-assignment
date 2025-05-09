import { ApiProperty } from '@nestjs/swagger';

/**
 * Data Transfer Object for returning status information via API.
 */
export class StatusDto {
  @ApiProperty({ description: 'Unique identifier for the status' })
  id: number;

  @ApiProperty({ description: 'Name of the shipment status' })
  name: string;
}
