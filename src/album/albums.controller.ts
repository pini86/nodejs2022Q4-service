import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  HttpCode,
  Put,
  forwardRef,
  Inject,
  HttpStatus,
} from '@nestjs/common';
import { AlbumService } from './album.service';
import { CreateAlbumDto } from './dto/create-album.dto';
import { UpdateAlbumDto } from './dto/update-album.dto';
import { Album } from './entities/album.entity';
import { validateID } from '../utils/validate';
import { FavoritesService } from '../favorite/favorites.service';

@Controller('album')
export class AlbumsController {
  constructor(
    @Inject(forwardRef(() => AlbumService))
    private readonly albumsService: AlbumService,
    @Inject(forwardRef(() => FavoritesService))
    private readonly favoritesService: FavoritesService,
  ) {}

  @Post()
  async create(@Body() createAlbumDto: CreateAlbumDto): Promise<Album> {
    return this.albumsService.create(createAlbumDto);
  }

  @Get()
  async getAll(): Promise<Album[]> {
    return this.albumsService.getAll();
  }

  @Get(':id')
  async getOne(@Param('id') id: string): Promise<Album> {
    validateID(id);
    return this.albumsService.getOne(id);
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateAlbumDto: UpdateAlbumDto,
  ): Promise<Album> {
    validateID(id);
    return this.albumsService.update(id, updateAlbumDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id') id: string) {
    validateID(id);
    try {
      await this.favoritesService.removeAlbum(id);
    } catch {}
    await this.albumsService.remove(id);
  }
}
