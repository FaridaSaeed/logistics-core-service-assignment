import { Injectable, OnModuleInit, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Status } from './status.entity';

/**
 * Service for managing shipment statuses and seeding default statuses on startup.
 */
@Injectable()
export class StatusService implements OnModuleInit {
  private readonly logger = new Logger(StatusService.name);
  private readonly defaultStatuses = [
    'Ready to Pick Up',
    'Out for Delivery',
    'Delivered',
  ];

  constructor(
    @InjectRepository(Status)
    private readonly statusRepo: Repository<Status>,
  ) {}

  /**
   * On application bootstrap, ensure default statuses exist in the DB.
   */
  async onModuleInit() {
    for (const name of this.defaultStatuses) {
      const exists = await this.statusRepo.findOne({ where: { name } });
      if (!exists) {
        const status = this.statusRepo.create({ name });
        await this.statusRepo.save(status);
        this.logger.log(`Seeded status: ${name}`);
      }
    }
  }

  /** Retrieve all statuses. */
  async findAll(): Promise<Status[]> {
    return this.statusRepo.find();
  }
}
