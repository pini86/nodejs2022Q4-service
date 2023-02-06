import {
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateArtistDto } from './dto/create-artist.dto';
import { UpdateArtistDto } from './dto/update-artist.dto';
import * as uuid from 'uuid';
import { Artist } from './entities/artist.entity';
import { AlbumService } from '../album/album.service';
import { TrackService } from '../track/track.service';
import { Errors_Messages } from '../utils/constants';

@Injectable()
export class ArtistService {
  private readonly artists: Artist[] = [];

  constructor(
    @Inject(forwardRef(() => TrackService))
    private readonly trackService: TrackService,
    @Inject(forwardRef(() => AlbumService))
    private readonly albumService: AlbumService,
  ) {}

  async create(createArtistDto: CreateArtistDto) {
    const newArtist = Object.assign(new Artist(), {
      id: uuid.v4(),
      ...createArtistDto,
    });
    this.artists.push(newArtist);
    return newArtist;
  }

  async getAll() {
    return this.artists;
  }

  async getOne(id: string) {
    const artist = this.artists.find((artist) => artist.id === id);
    if (!artist) {
      throw new NotFoundException(Errors_Messages.ARTIST_NOT_FOUND);
    }
    return artist;
  }

  async update(id: string, updateArtistDto: UpdateArtistDto) {
    return Object.assign(await this.getOne(id), updateArtistDto);
  }

  async remove(id: string) {
    const artistIndex = this.artists.findIndex((artist) => artist.id === id);

    if (artistIndex === -1) {
      throw new NotFoundException(Errors_Messages.ARTIST_NOT_FOUND);
    }

    this.artists.splice(artistIndex, 1);

    await this.albumService.removeArtist(id);

    await this.trackService.removeArtist(id);
  }
}
