import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { TrackEntity } from './entities/track.entity';
import { TrackService } from './track.service';
import { validateID } from '../utils/validate';
import { CreateTrackDto } from './dto/create-track.dto';
import { UpdateTrackDto } from './dto/update-track.dto';

@Controller('track')
export class TrackController {
  constructor(private readonly TrackService: TrackService) {}

  @Get()
  getAll(): TrackEntity[] {
    return this.TrackService.getAll();
  }

  @Get(':id')
  getOne(@Param('id') id: string): TrackEntity {
    validateID(id);
    return this.TrackService.getOne(id);
  }

  @Post()
  create(@Body() createTrackDto: CreateTrackDto): TrackEntity {
    return this.TrackService.create(createTrackDto);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updateTrackDto: UpdateTrackDto) {
    validateID(id);
    return this.TrackService.update(id, updateTrackDto);
  }

  @Delete(':id')
  @HttpCode(204)
  remove(@Param('id') id: string): void {
    validateID(id);
    this.TrackService.remove(id);
  }
}
