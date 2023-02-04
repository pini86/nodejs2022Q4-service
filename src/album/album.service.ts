import {
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateAlbumDto } from './dto/create-album.dto';
import { UpdateAlbumDto } from './dto/update-album.dto';
import * as uuid from 'uuid';
import { TrackService } from '../track/track.service';
import { Album } from './entities/album.entity';
import { Errors_Messages } from '../utils/constants';

@Injectable()
export class AlbumService {
  private readonly albums: Album[] = [];

  constructor(
    @Inject(forwardRef(() => TrackService))
    private readonly trackService: TrackService,
  ) {}

  async create(createAlbumDto: CreateAlbumDto) {
    const newAlbum = Object.assign(new Album(), {
      id: uuid.v4(),
      ...createAlbumDto,
    });

    this.albums.push(newAlbum);

    return newAlbum;
  }

  async getAll() {
    return this.albums;
  }

  async getOne(id: string) {
    const album = this.albums.find((album) => album.id === id);
    if (!album) {
      throw new NotFoundException(Errors_Messages.ALBUM_NOT_FOUND);
    }
    return album;
  }

  async update(id: string, updateAlbumDto: UpdateAlbumDto) {
    return Object.assign(await this.getOne(id), updateAlbumDto);
  }

  async remove(id: string) {
    const albumIndex = this.albums.findIndex((item) => item.id === id);

    if (albumIndex === -1) {
      throw new NotFoundException(Errors_Messages.ALBUM_NOT_FOUND);
    }
    await this.trackService.removeAlbum(id);

    return this.albums.splice(albumIndex, 1)[0];
  }

  async removeArtist(id: string) {
    this.albums.forEach((album) => {
      if (album.artistId === id) {
        album.artistId = null;
      }
    });
  }
}
