import {
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateArtistDto } from './dto/create-artist.dto';
import { UpdateArtistDto } from './dto/update-artist.dto';
import { Artist } from './entities/artist.entity';
import { AlbumService } from '../album/album.service';
import { TrackService } from '../track/track.service';
import { Errors_Messages } from '../utils/constants';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class ArtistService {
  constructor(
    private readonly trackService: TrackService,
    private readonly albumService: AlbumService,
    @InjectRepository(Artist)
    private readonly artistsRepository: Repository<Artist>,
  ) {}

  async create(createArtistDto: CreateArtistDto) {
    const artist = this.artistsRepository.create(createArtistDto);
    return this.artistsRepository.save(artist);
  }

  async getAll() {
    return this.artistsRepository.find();
  }

  async getOne(id: string) {
    const artist = await this.artistsRepository.findOneBy({ id });
    if (!artist) {
      throw new NotFoundException(Errors_Messages.ARTIST_NOT_FOUND);
    }
    return artist;
  }

  async update(id: string, updateArtistDto: UpdateArtistDto) {
    const artist = Object.assign(await this.getOne(id), updateArtistDto);
    return this.artistsRepository.save(artist);
  }

  async remove(id: string) {
    /* const artistIndex = this.artists.findIndex((artist) => artist.id === id);

    if (artistIndex === -1) {
      throw new NotFoundException(Errors_Messages.ARTIST_NOT_FOUND);
    }

    this.artists.splice(artistIndex, 1);

    await this.albumService.removeArtist(id);

    await this.trackService.removeArtist(id); */
    const artist = await this.getOne(id);
    return this.artistsRepository.remove(artist);
  }
}
