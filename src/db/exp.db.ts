import { Global, Injectable } from '@nestjs/common';
import { User } from '../user/entities/user.entity';
import { Artist } from '../artist/entities/artist.entity';
import { Album } from '../album/entities/album.entity';
import { Track } from '../track/entities/track.entity';
import { Favorites } from '../favorite/interfaces/favorites.model';

@Injectable()
@Global()
class DataBaseInMemory {
  artists: Artist[] = [];
  tracks: Track[] = [];
  albums: Album[] = [];
  users: User[] = [];
  favorites: Favorites = {
    artists: [],
    tracks: [],
    albums: [],
  };
}

export { DataBaseInMemory };
