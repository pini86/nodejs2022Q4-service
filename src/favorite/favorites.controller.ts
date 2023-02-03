import { Controller, Get, Post, Param, Delete, HttpCode } from '@nestjs/common';
import { FavoritesService } from './favorites.service';
import { FavoritesResponse } from './interfaces/favorites.model';
import { validateID } from '../utils/validate';

@Controller('favs')
export class FavoritesController {
  constructor(private readonly favoritesService: FavoritesService) {}

  @Get()
  async getAll(): Promise<FavoritesResponse> {
    return this.favoritesService.getAll();
  }

  @Post('track/:id')
  async addTrack(@Param('id') id: string) {
    validateID(id);
    return this.favoritesService.addTrack(id);
  }

  @Post('artist/:id')
  async addArtist(@Param('id') id: string) {
    validateID(id);
    return this.favoritesService.addArtist(id);
  }

  @Post('album/:id')
  async addAlbum(@Param('id') id: string) {
    validateID(id);
    return this.favoritesService.addAlbum(id);
  }

  @Delete('artist/:id')
  @HttpCode(204)
  async removeArtist(@Param('id') id: string) {
    validateID(id);
    await this.favoritesService.removeArtist(id);
  }

  @Delete('album/:id')
  @HttpCode(204)
  async removeAlbum(@Param('id') id: string) {
    validateID(id);
    await this.favoritesService.removeAlbum(id);
  }

  @Delete('track/:id')
  @HttpCode(204)
  async removeTrack(@Param('id') id: string) {
    validateID(id);
    await this.favoritesService.removeTrack(id);
  }
}
