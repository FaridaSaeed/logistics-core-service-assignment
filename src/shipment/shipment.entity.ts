import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Status } from '../status/status.entity';

/**
 * Entity representing a shipment in the logistics system.
 */
@Entity()
export class Shipment {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @CreateDateColumn()
  creationDate: Date;

  @UpdateDateColumn()
  modificationDate: Date;

  @Column({ unique: true })
  trackingId: string;

  @Column()
  phoneNumber: string;

  // Allow null in DB and TS so we can assign null explicitly
  @Column({ type: 'text', nullable: true })
  description: string | null;

  @ManyToOne(() => Status, (status) => status.shipments, { eager: true })
  @JoinColumn({ name: 'statusId' })
  status: Status;
}
