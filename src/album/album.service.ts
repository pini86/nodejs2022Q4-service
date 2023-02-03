import {
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateAlbumDto } from './dto/create-album.dto';
import { UpdateAlbumDto } from './dto/update-album.dto';
import * as uuid from 'uuid';
import { DataBaseInMemory } from '../db/exp.db';
import { TrackService } from '../track/track.service';
import { Album } from './entities/album.entity';

@Injectable()
export class AlbumService {
  constructor(
    private dataBase: DataBaseInMemory,
    @Inject(forwardRef(() => TrackService))
    private readonly trackService: TrackService,
  ) {}

  create(createAlbumDto: CreateAlbumDto) {
    const newAlbum = Object.assign(new Album(), {
      id: uuid.v4(),
      ...createAlbumDto,
    });

    this.dataBase.albums.push(newAlbum);

    return newAlbum;
  }

  getAll() {
    return this.dataBase.albums;
  }

  getOne(id: string) {
    const album = this.dataBase.albums.find((album) => album.id === id);
    if (!album) {
      throw new NotFoundException('Album not found');
    }
    return album;
  }

  update(id: string, updateAlbumDto: UpdateAlbumDto) {
    return Object.assign(this.getOne(id), updateAlbumDto);
  }

  remove(id: string) {
    const albumIndex = this.dataBase.albums.findIndex(
      (album) => album.id === id,
    );

    if (albumIndex === -1) {
      throw new NotFoundException('Album not found');
    }

    this.dataBase.albums.splice(albumIndex, 1);

    this.trackService.removeAlbum(id);
  }

  async removeArtist(id: string) {
    this.dataBase.albums.forEach((album) => {
      if (album.artistId === id) {
        album.artistId = null;
      }
    });
  }
}
