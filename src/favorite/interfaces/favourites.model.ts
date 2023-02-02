import { Artist } from '../../artist/interfaces/artist.model';
import { Album } from '../../album/interfaces/album.model';
import { Track } from '../../track/interfaces/track.model';

interface Favorites {
  artists: string[];
  albums: string[];
  tracks: string[];
}

interface FavoritesResponse {
  artists: Artist[];
  albums: Album[];
  tracks: Track[];
}

export { Favorites, FavoritesResponse };
