import { forwardRef, Module } from '@nestjs/common';
import { AlbumService } from './album.service';
import { AlbumController } from './album.controller';
import { FavoritesModule } from '../favorite/favorites.module';
import { TrackModule } from '../track/track.module';
import { ArtistModule } from 'src/artist/artist.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Album } from './entities/album.entity';

@Module({
  imports: [
    forwardRef(() => FavoritesModule),
    forwardRef(() => TrackModule),
    forwardRef(() => ArtistModule),
    TypeOrmModule.forFeature([Album]),
  ],
  exports: [AlbumService],
  controllers: [AlbumController],
  providers: [AlbumService],
})
export class AlbumModule {}
