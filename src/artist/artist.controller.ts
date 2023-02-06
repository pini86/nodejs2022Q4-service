import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  HttpCode,
  Put,
  Inject,
  forwardRef,
  HttpStatus,
} from '@nestjs/common';
import { ArtistService } from './artist.service';
import { CreateArtistDto } from './dto/create-artist.dto';
import { UpdateArtistDto } from './dto/update-artist.dto';
import { Artist } from './entities/artist.entity';
import { validateID } from '../utils/validate';
import { FavoritesService } from 'src/favorite/favorites.service';

@Controller('artist')
export class ArtistController {
  constructor(
    @Inject(forwardRef(() => ArtistService))
    private readonly artistService: ArtistService,
    @Inject(forwardRef(() => FavoritesService))
    private readonly favoritesService: FavoritesService,
  ) {}

  @Post()
  async create(@Body() createArtistDto: CreateArtistDto): Promise<Artist> {
    return this.artistService.create(createArtistDto);
  }

  @Get()
  async getAll(): Promise<Artist[]> {
    return this.artistService.getAll();
  }

  @Get(':id')
  async getOne(@Param('id') id: string): Promise<Artist> {
    validateID(id);
    return this.artistService.getOne(id);
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateArtistDto: UpdateArtistDto,
  ): Promise<Artist> {
    validateID(id);
    return this.artistService.update(id, updateArtistDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id') id: string) {
    validateID(id);
    try {
      await this.favoritesService.removeArtist(id);
    } catch {}
    await this.artistService.remove(id);
  }
}
