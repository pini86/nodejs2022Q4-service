import { forwardRef, Module } from '@nestjs/common';
import { AlbumService } from './album.service';
import { AlbumController } from './album.controller';
import { DBModule } from '../db/db.module';
import { TrackModule } from '../track/track.module';

@Module({
  imports: [DBModule, forwardRef(() => TrackModule)],
  exports: [AlbumService],
  controllers: [AlbumController],
  providers: [AlbumService],
})
export class AlbumModule {}
