import { IsNotEmpty, IsString, IsOptional, IsPhoneNumber, Matches } from 'class-validator';

export class CreateShipmentDto {
  @IsString()
  @IsNotEmpty()
  trackingId: string; // Required and must be a string

  //@IsNotEmpty()
  //phoneNumber: string;     // Must be a non-empty phone number
  //@IsPhoneNumber('EG')         // Validates international phone numbers
  @IsNotEmpty()
  @Matches(/^\+20\d{10}$/, { message: 'Phone number must be in the format +20 followed by 10 digits' }) 
  phoneNumber: string; // Must be a non-empty phone number in the format +20 followed by 10 digits

  @IsOptional()
  @IsString()
  description?: string;    // Optional shipment description
}
