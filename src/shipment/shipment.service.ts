import {
  Injectable,
  NotFoundException,
  BadRequestException,
  Logger,
  InternalServerErrorException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Shipment } from './shipment.entity';
import { Status } from '../status/status.entity';
import { CreateShipmentDto } from './dto/create-shipment.dto';

/**
 * Service responsible for managing shipments,
 * including creation, retrieval, deletion, and status transitions.
 */
@Injectable()
export class ShipmentService {
  private readonly logger = new Logger(ShipmentService.name);

  constructor(
    @InjectRepository(Shipment)
    private shipmentRepo: Repository<Shipment>,

    @InjectRepository(Status)
    private statusRepo: Repository<Status>,
  ) {}

  /**
   * Creates a new shipment with the default "Ready to Pick Up" status.
   */
  async create(createDto: CreateShipmentDto): Promise<Shipment> {
    try {
      // Check if trackingId already exists (to prevent duplicates)
      const existing = await this.shipmentRepo.findOne({
        where: { trackingId: createDto.trackingId },
      });
      if (existing) {
        throw new ConflictException(
          `Shipment with trackingId "${createDto.trackingId}" already exists`,
        );
      }

      // Fetch the default status
      const defaultStatus = await this.getStatusByName('Ready to Pick Up');
      if (!defaultStatus) {
        throw new InternalServerErrorException('Default status not found');
      }

      // Create the shipment entity
      const shipment = this.shipmentRepo.create({
        trackingId: createDto.trackingId,
        phoneNumber: createDto.phoneNumber,
        description: createDto.description ?? null,
        status: defaultStatus,
      });

      this.logger.log(
        `Creating shipment ${createDto.trackingId} with status ${defaultStatus.name}`,
      );

      // Save to the database
      return await this.shipmentRepo.save(shipment);
    } catch (error) {
      this.logger.error(
        `Failed to create shipment: ${error.message}`,
        error.stack,
      );

      // Known exceptions are re-thrown
      if (
        error instanceof ConflictException ||
        error instanceof InternalServerErrorException
      ) {
        throw error;
      }

      // Any unknown error is wrapped
      throw new InternalServerErrorException(
        'An unexpected error occurred while creating the shipment',
      );
    }
  }

  /**
   * Retrieves all shipments (including status).
   */
  async findAll(): Promise<Shipment[]> {
    return this.shipmentRepo.find({ relations: ['status'] });
  }

  /**
   * Retrieves a single shipment by its ID.
   */
  async findOne(id: string): Promise<Shipment> {
    const shipment = await this.shipmentRepo.findOne({
      where: { id },
      relations: ['status'],
    });

    if (!shipment) {
      this.logger.warn(`Shipment ${id} not found`);
      throw new NotFoundException(`Shipment with ID ${id} not found`);
    }

    return shipment;
  }

  /**
   * Deletes a shipment by its ID.
   */
  async remove(id: string): Promise<{ message: string }> {
    const result = await this.shipmentRepo.delete(id);

    if (result.affected === 0) {
      this.logger.warn(`Delete failed: Shipment ${id} not found`);
      throw new NotFoundException(`Shipment with ID ${id} not found`);
    }

    this.logger.log(`Deleted shipment ${id}`);
    return { message: `Shipment ${id} deleted successfully` };
  }

  /**
   * Handles transitions between shipment statuses in a controlled manner.
   *
   * @param id Shipment ID
   * @param expectedCurrent The current status the shipment must be in
   * @param nextStatus The target status to move to
   */
  private async transition(
    id: string,
    expectedCurrent: string,
    nextStatus: string,
  ): Promise<Shipment> {
    const shipment = await this.findOne(id);
    const current = shipment.status.name;

    // Ensure the current status is valid for this transition
    if (current !== expectedCurrent) {
      throw new BadRequestException(
        `Cannot move to '${nextStatus}' from '${current}'. Expected status: '${expectedCurrent}'`,
      );
    }

    const next = await this.getStatusByName(nextStatus);
    shipment.status = next;

    this.logger.log(
      `Shipment ${shipment.trackingId} transitioned from '${current}' to '${nextStatus}'`,
    );

    return this.shipmentRepo.save(shipment);
  }

  /**
   * Moves shipment from "Ready to Pick Up" to "Out for Delivery"
   */
  async checkout(id: string): Promise<Shipment> {
    return this.transition(id, 'Ready to Pick Up', 'Out for Delivery');
  }

  /**
   * Moves shipment from "Out for Delivery" to "Delivered"
   */
  async deliver(id: string): Promise<Shipment> {
    return this.transition(id, 'Out for Delivery', 'Delivered');
  }

  /**
   * Retrieves a status entity by its name or throws if not found.
   */
  private async getStatusByName(name: string): Promise<Status> {
    const status = await this.statusRepo.findOne({ where: { name } });
    if (!status) {
      this.logger.error(`Status '${name}' is not configured`);
      throw new BadRequestException(`Status '${name}' not found`);
    }
    return status;
  }
}
