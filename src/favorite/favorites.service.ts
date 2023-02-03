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
      throw new UnprocessableEntityException('Artist not exists');
    }

    if (this.artists.includes(id)) {
      return { message: 'Artist exists in favorites' };
    }

    this.artists.push(id);
    return { message: 'Favorites added successfully' };
  }

  async addAlbum(id: string) {
    try {
      await this.albumService.getOne(id);
    } catch {
      throw new UnprocessableEntityException('Album not exists');
    }
    if (this.albums.includes(id)) {
      return { message: 'Album exists in favorites' };
    }

    this.albums.push(id);
    return { message: 'Favorites added successfully' };
  }

  async addTrack(id: string) {
    try {
      await this.trackService.getOne(id);
    } catch {
      throw new UnprocessableEntityException('Track not exists');
    }
    if (this.tracks.includes(id)) {
      return { message: 'Track exists in favorites' };
    }

    this.tracks.push(id);
    return { message: 'Favorites added successfully' };
  }

  async removeArtist(id: string) {
    const artistIndex = this.artists.findIndex((artistId) => artistId === id);

    if (artistIndex === -1) {
      throw new NotFoundException('Artist not found');
    }

    this.artists.splice(artistIndex, 1);
  }

  async removeAlbum(id: string) {
    const albumIndex = this.albums.findIndex((albumId) => albumId === id);

    if (albumIndex === -1) {
      throw new NotFoundException('Album not found');
    }

    this.albums.splice(albumIndex, 1);
  }

  async removeTrack(id: string) {
    const trackIndex = this.tracks.findIndex((trackId) => trackId === id);

    if (trackIndex === -1) {
      throw new NotFoundException('Album not found');
    }

    this.tracks.splice(trackIndex, 1);
  }
}
