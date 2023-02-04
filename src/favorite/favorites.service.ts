import {
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { ArtistService } from '../artist/artist.service';
import { AlbumService } from '../album/album.service';
import { TrackService } from '../track/track.service';
import { Errors_Messages } from '../utils/constants';

@Injectable()
export class FavoritesService {
  private readonly artists: string[] = [];
  private readonly albums: string[] = [];
  private readonly tracks: string[] = [];

  constructor(
    @Inject(forwardRef(() => ArtistService))
    private readonly artistService: ArtistService,
    @Inject(forwardRef(() => AlbumService))
    private readonly albumService: AlbumService,
    @Inject(forwardRef(() => TrackService))
    private readonly trackService: TrackService,
  ) {}

  async getAll() {
    const allAlbums = await this.albumService.getAll();
    const allArtists = await this.artistService.getAll();
    const allTracks = await this.trackService.getAll();

    const albumsFav = allAlbums.filter((item) => this.albums.includes(item.id));
    const artistsFav = allArtists.filter((item) =>
      this.artists.includes(item.id),
    );
    const tracksFav = allTracks.filter((item) => this.tracks.includes(item.id));

    return {
      albums: albumsFav,
      artists: artistsFav,
      tracks: tracksFav,
    };
  }

  async addArtist(id: string) {
    try {
      await this.artistService.getOne(id);
    } catch {
      throw new UnprocessableEntityException(Errors_Messages.ARTIST_NOT_EXISTS);
    }

    if (this.artists.includes(id)) {
      return { message: Errors_Messages.ALREADY_EXISTS_FAV };
    }

    this.artists.push(id);
    return { message: Errors_Messages.FAV_ADDED };
  }

  async addAlbum(id: string) {
    try {
      await this.albumService.getOne(id);
    } catch {
      throw new UnprocessableEntityException(Errors_Messages.ALBUM_NOT_EXISTS);
    }
    if (this.albums.includes(id)) {
      return { message: Errors_Messages.ALREADY_EXISTS_FAV };
    }

    this.albums.push(id);
    return { message: Errors_Messages.FAV_ADDED };
  }

  async addTrack(id: string) {
    try {
      await this.trackService.getOne(id);
    } catch {
      throw new UnprocessableEntityException(Errors_Messages.TRACK_NOT_EXISTS);
    }
    if (this.tracks.includes(id)) {
      return { message: Errors_Messages.ALREADY_EXISTS_FAV };
    }

    this.tracks.push(id);
    return { message: Errors_Messages.FAV_ADDED };
  }

  async removeArtist(id: string) {
    const artistIndex = this.artists.findIndex((artistId) => artistId === id);

    if (artistIndex === -1) {
      throw new NotFoundException(Errors_Messages.ARTIST_NOT_FOUND);
    }

    this.artists.splice(artistIndex, 1);
  }

  async removeAlbum(id: string) {
    const albumIndex = this.albums.findIndex((albumId) => albumId === id);

    if (albumIndex === -1) {
      throw new NotFoundException(Errors_Messages.ALBUM_NOT_FOUND);
    }

    this.albums.splice(albumIndex, 1);
  }

  async removeTrack(id: string) {
    const trackIndex = this.tracks.findIndex((trackId) => trackId === id);

    if (trackIndex === -1) {
      throw new NotFoundException(Errors_Messages.TRACK_NOT_FOUND);
    }

    this.tracks.splice(trackIndex, 1);
  }
}
