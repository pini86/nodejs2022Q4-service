import {
  Body,
  Controller,
  Delete,
  forwardRef,
  Get,
  HttpCode,
  HttpStatus,
  Inject,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { Track } from './entities/track.entity';
import { TrackService } from './track.service';
import { validateID } from '../utils/validate';
import { CreateTrackDto } from './dto/create-track.dto';
import { UpdateTrackDto } from './dto/update-track.dto';
import { FavoritesService } from 'src/favorite/favorites.service';

@Controller('track')
export class TrackController {
  constructor(
    @Inject(forwardRef(() => TrackService))
    private readonly trackService: TrackService,
    @Inject(forwardRef(() => FavoritesService))
    private readonly favoritesService: FavoritesService,
  ) {}

  @Get()
  async getAll(): Promise<Track[]> {
    return this.trackService.getAll();
  }

  @Get(':id')
  async getOne(@Param('id') id: string): Promise<Track> {
    validateID(id);
    return this.trackService.getOne(id);
  }

  @Post()
  async create(@Body() createTrackDto: CreateTrackDto): Promise<Track> {
    return this.trackService.create(createTrackDto);
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateTrackDto: UpdateTrackDto,
  ) {
    validateID(id);
    return this.trackService.update(id, updateTrackDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id') id: string) {
    validateID(id);
    try {
      await this.favoritesService.removeTrack(id);
    } catch {}
    await this.trackService.remove(id);
  }
}
