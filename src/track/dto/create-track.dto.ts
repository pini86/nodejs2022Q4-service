import {
  IsNotEmpty,
  IsString,
  IsOptional,
  IsUUID,
  IsNumber,
  IsPositive,
} from 'class-validator';
import { UUID_VER } from '../../utils/constants';

export class CreateTrackDto {
  @IsNotEmpty()
  @IsString()
  readonly name: string;

  @IsOptional()
  @IsUUID(UUID_VER)
  readonly artistId?: string | null = null;

  @IsOptional()
  @IsUUID(UUID_VER)
  readonly albumId?: string | null = null;

  @IsNumber()
  @IsPositive()
  readonly duration: number;
}
