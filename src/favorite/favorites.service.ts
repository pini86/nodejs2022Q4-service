import {
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { ArtistService } from '../artist/artist.service';
import { AlbumService } from '../album/album.service';
import { TrackService } from '../track/track.service';
import { Errors_Messages, FAVORITE_TECH_ID } from '../utils/constants';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Favorite } from './entities/favorite.entity';
import { FavoritesResponse } from './interfaces/favorites.model';

@Injectable()
export class FavoritesService {
  constructor(
    private readonly albumService: AlbumService,
    private readonly artistService: ArtistService,
    private readonly trackService: TrackService,
    @InjectRepository(Favorite)
    private readonly favoritesRepository: Repository<Favorite>,
  ) {}

  async getAll(): Promise<Favorite> {
    return await this.favoritesRepository.findOneBy({
      id: FAVORITE_TECH_ID,
    });
  }

  async getAllResponse(favs: Favorite): Promise<FavoritesResponse> {
    const allAlbums = await this.albumService.getAll();
    const allArtists = await this.artistService.getAll();
    const allTracks = await this.trackService.getAll();

    const albums = allAlbums.filter((item) => favs.albums.includes(item.id));
    const artists = allArtists.filter((item) => favs.artists.includes(item.id));
    const tracks = allTracks.filter((item) => favs.tracks.includes(item.id));

    return {
      albums,
      artists,
      tracks,
    };
  }

  async addArtist(id: string) {
    try {
      const artist = await this.artistService.getOne(id);
      const favorites = await this.getAll();

      if (!favorites.artists.find((item) => item === id)) {
        favorites.artists.push(artist.id);
        await this.favoritesRepository.save(favorites);
      } else {
      }
    } catch {
      throw new UnprocessableEntityException(Errors_Messages.ARTIST_NOT_EXISTS);
    }
  }

  async addAlbum(id: string) {
    try {
      const album = await this.albumService.getOne(id);
      const favorites = await this.getAll();

      if (!favorites.albums.find((item) => item === id)) {
        favorites.albums.push(album.id);
        await this.favoritesRepository.save(favorites);
      }
    } catch {
      throw new UnprocessableEntityException(Errors_Messages.ALBUM_NOT_EXISTS);
    }
  }

  async addTrack(id: string) {
    try {
      const track = await this.trackService.getOne(id);
      const favorites = await this.getAll();

      if (!favorites.tracks.find((item) => item === id)) {
        favorites.tracks.push(track.id);
        await this.favoritesRepository.save(favorites);
      }
    } catch {
      throw new UnprocessableEntityException(Errors_Messages.TRACK_NOT_EXISTS);
    }
  }

  async removeArtist(id: string) {
    const favorites = await this.getAll();
    const artistIndex = favorites.artists.findIndex((item) => item === id);

    if (artistIndex === -1) {
      throw new NotFoundException(Errors_Messages.ARTIST_NOT_FOUND);
    }

    favorites.artists.splice(artistIndex, 1);
    await this.favoritesRepository.save(favorites);
  }

  async removeAlbum(id: string) {
    const favorites = await this.getAll();
    const albumIndex = favorites.albums.findIndex((item) => item === id);

    if (albumIndex === -1) {
      throw new NotFoundException(Errors_Messages.ALBUM_NOT_FOUND);
    }

    favorites.albums.splice(albumIndex, 1);
    await this.favoritesRepository.save(favorites);
  }

  async removeTrack(id: string) {
    const favorites = await this.getAll();
    const trackIndex = favorites.tracks.findIndex((item) => item === id);

    if (trackIndex === -1) {
      throw new NotFoundException(Errors_Messages.TRACK_NOT_FOUND);
    }

    favorites.tracks.splice(trackIndex, 1);
    await this.favoritesRepository.save(favorites);
  }
}
