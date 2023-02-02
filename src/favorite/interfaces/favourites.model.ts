import { Artist } from '../../artist/interfaces/artist.model';
import { Album } from '../../album/interfaces/album.model';
import { Track } from '../../track/interfaces/track.model';

export interface Favourites {
  artists: string[];
  albums: string[];
  tracks: string[];
}

export interface FavouritesResponse {
  artists: Artist[];
  albums: Album[];
  tracks: Track[];
}

export { Favourites, FavouritesResponse };
