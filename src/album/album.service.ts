import {
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateAlbumDto } from './dto/create-album.dto';
import { UpdateAlbumDto } from './dto/update-album.dto';
import { TrackService } from '../track/track.service';
import { Album } from './entities/album.entity';
import { Errors_Messages } from '../utils/constants';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class AlbumService {
  constructor(
    @Inject(forwardRef(() => TrackService))
    private readonly trackService: TrackService,
    @InjectRepository(Album)
    private readonly albumsRepository: Repository<Album>,
  ) {}

  async create(createAlbumDto: CreateAlbumDto) {
    const album = this.albumsRepository.create(createAlbumDto);
    return this.albumsRepository.save(album);
  }

  async getAll() {
    return this.albumsRepository.find();
  }

  async getOne(id: string) {
    const album = await this.albumsRepository.findOneBy({ id });
    if (!album) {
      throw new NotFoundException(Errors_Messages.ALBUM_NOT_FOUND);
    }
    return album;
  }

  async update(id: string, updateAlbumDto: UpdateAlbumDto) {
    const album = Object.assign(await this.getOne(id), updateAlbumDto);
    return this.albumsRepository.save(album);
  }

  async remove(id: string) {
    const album = await this.getOne(id);
    return this.albumsRepository.remove(album);

    /*  const albumIndex = this.albums.findIndex((item) => item.id === id);

    if (albumIndex === -1) {
      throw new NotFoundException(Errors_Messages.ALBUM_NOT_FOUND);
    }
    await this.trackService.removeAlbum(id);

    return this.albums.splice(albumIndex, 1)[0]; */
  }

  /*  async removeArtist(id: string) {
    this.albums.forEach((album) => {
      if (album.artistId === id) {
        album.artistId = null;
      }
    });
  } */
}
