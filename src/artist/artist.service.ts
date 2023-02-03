import {
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateArtistDto } from './dto/create-artist.dto';
import { UpdateArtistDto } from './dto/update-artist.dto';
import { DataBaseInMemory } from '../db/exp.db';
import * as uuid from 'uuid';
import { Artist } from './entities/artist.entity';
import { AlbumService } from '../album/album.service';
import { TrackService } from '../track/track.service';

@Injectable()
export class ArtistService {
  constructor(
    private dataBase: DataBaseInMemory,
    @Inject(forwardRef(() => TrackService))
    private readonly trackService: TrackService,
    @Inject(forwardRef(() => AlbumService))
    private readonly albumService: AlbumService,
  ) {}

  create(createArtistDto: CreateArtistDto) {
    const newArtist = Object.assign(new Artist(), {
      id: uuid.v4(),
      ...createArtistDto,
    });
    this.dataBase.artists.push(newArtist);
    return newArtist;
  }

  getAll() {
    return this.dataBase.artists;
  }

  getOne(id: string) {
    const artist = this.dataBase.artists.find((artist) => artist.id === id);
    if (!artist) {
      throw new NotFoundException('Artist not found');
    }
    return artist;
  }

  update(id: string, updateArtistDto: UpdateArtistDto) {
    return Object.assign(this.getOne(id), updateArtistDto);
  }

  remove(id: string): void {
    const artistIndex = this.dataBase.artists.findIndex(
      (artist) => artist.id === id,
    );

    if (artistIndex === -1) {
      throw new NotFoundException('Artist not found');
    }

    this.dataBase.artists.splice(artistIndex, 1);

    this.trackService.removeArtist(id);
  }
}
