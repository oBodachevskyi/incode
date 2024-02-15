import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  ValidateIf,
} from 'class-validator';
import { UserRole } from '../types/enums';

export class CreateUserDto {
  @IsNotEmpty()
  readonly username: string;

  @IsNotEmpty()
  @IsEmail()
  readonly email: string;

  @IsNotEmpty()
  readonly password: string;

  @IsNotEmpty()
  @IsEnum(UserRole)
  readonly role: UserRole;

  @ValidateIf((object) => object.role === UserRole.REGULAR)
  @IsNumber()
  readonly boss?: number;
}
