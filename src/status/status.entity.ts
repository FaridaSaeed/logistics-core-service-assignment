import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
} from 'typeorm';
import { Shipment } from '../shipment/shipment.entity';

/**
 * Entity representing a possible status of a Shipment.
 * Examples: "Ready to Pick Up", "Out for Delivery", "Delivered".
 */
@Entity()
export class Status {
  @PrimaryGeneratedColumn() // Auto-incrementing primary key
  id: number;

  @Column({ unique: true }) // Status name must be unique
  name: string;

  @OneToMany(() => Shipment, (shipment) => shipment.status)
  shipments: Shipment[]; // Back-reference to shipments with this status
}
