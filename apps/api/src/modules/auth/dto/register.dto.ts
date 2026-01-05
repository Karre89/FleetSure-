import { IsEmail, IsString, MinLength, IsOptional, IsEnum } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'

export enum RegisterRole {
  FLEET = 'fleet',
  MECHANIC = 'mechanic',
  RUNNER = 'runner',
}

export class RegisterDto {
  @ApiProperty({ example: 'owner@newfleet.com' })
  @IsEmail()
  email: string

  @ApiProperty({ example: 'securepassword123' })
  @IsString()
  @MinLength(8)
  password: string

  @ApiProperty({ example: 'John' })
  @IsString()
  firstName: string

  @ApiProperty({ example: 'Doe' })
  @IsString()
  lastName: string

  @ApiProperty({ example: '+12065551234' })
  @IsString()
  phone: string

  @ApiProperty({ enum: RegisterRole, example: 'fleet' })
  @IsEnum(RegisterRole)
  role: RegisterRole

  @ApiProperty({ example: 'Northwest Trucking LLC', required: false })
  @IsOptional()
  @IsString()
  fleetName?: string

  @ApiProperty({ example: '123 Main St, Seattle, WA', required: false })
  @IsOptional()
  @IsString()
  fleetAddress?: string
}
