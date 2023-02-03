import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  HttpCode,
  Put,
} from '@nestjs/common';
import { AlbumService } from './album.service';
import { CreateAlbumDto } from './dto/create-album.dto';
import { UpdateAlbumDto } from './dto/update-album.dto';
import { Album } from './entities/album.entity';
import { validateID } from '../utils/validate';

@Controller('album')
export class AlbumController {
  constructor(private readonly albumService: AlbumService) {}

  @Post()
  create(@Body() createAlbumDto: CreateAlbumDto): Album {
    return this.albumService.create(createAlbumDto);
  }

  @Get()
  getAll(): Album[] {
    return this.albumService.getAll();
  }

  @Get(':id')
  getOne(@Param('id') id: string): Album {
    validateID(id);
    return this.albumService.getOne(id);
  }

  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() updateAlbumDto: UpdateAlbumDto,
  ): Album {
    validateID(id);
    return this.albumService.update(id, updateAlbumDto);
  }

  @Delete(':id')
  @HttpCode(204)
  remove(@Param('id') id: string): void {
    validateID(id);
    this.albumService.remove(id);
  }
}
