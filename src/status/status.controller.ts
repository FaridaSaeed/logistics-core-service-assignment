import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { StatusService } from './status.service';
import { Status } from './status.entity';

@ApiTags('statuses')
@Controller('statuses')
export class StatusController {
  constructor(private readonly statusService: StatusService) {}

  /**
   * Retrieve all shipment statuses.
   * This endpoint returns the list of available statuses,
   * which are seeded on application startup.
   */
  @Get()
  @ApiOperation({ summary: 'List all shipment statuses' })
  @ApiResponse({
    status: 200,
    description: 'List of statuses retrieved successfully.',
    type: [Status],
  })
  async findAll(): Promise<Status[]> {
    return this.statusService.findAll();
  }
}
