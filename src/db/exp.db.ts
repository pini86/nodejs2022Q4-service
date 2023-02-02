import { Global, Injectable } from '@nestjs/common';
import { User } from '../user/interfaces/user.model';
import { Artist } from '../artist/interfaces/artist.model';
import { Album } from '../album/interfaces/album.model';
import { Track } from '../track/interfaces/track.model';
import { Favorites } from '../favorite/interfaces/favourites.model';

@Injectable()
@Global()
class DataBaseInMemory {
  artists: Artist[] = [];
  tracks: Track[] = [];
  albums: Album[] = [];
  users: User[] = [];
  favourites: Favorites = {
    artists: [],
    tracks: [],
    albums: [],
  };
}

export { DataBaseInMemory };
