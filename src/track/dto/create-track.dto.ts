import {
  IsNotEmpty,
  IsString,
  IsOptional,
  IsUUID,
  IsNumber,
  IsPositive,
} from 'class-validator';

const UUID_VERSION = 4;

export class CreateTrackDto {
  @IsNotEmpty()
  @IsString()
  readonly name: string;

  @IsOptional()
  @IsUUID(UUID_VERSION)
  readonly artistId?: string | null = null;

  @IsOptional()
  @IsUUID(UUID_VERSION)
  readonly albumId?: string | null = null;

  @IsNumber()
  @IsPositive()
  readonly duration: number;
}
