enum Errors_Messages {
  USER_NOT_FOUND = 'User not found',
  USER_EXISTS = 'User already exists',
  WRONG_PASSWORD = 'Wrong password',
  INVALID_UUID = 'Invalid id',
  TRACK_NOT_FOUND = 'Track not found',
  ARTIST_NOT_EXISTS = 'Artist not exists',
  ALREADY_EXISTS_FAV = 'Already exists in favorites',
  FAV_ADDED = 'Favorites added successfully',
  ALBUM_NOT_EXISTS = 'Album not exists',
  TRACK_NOT_EXISTS = 'Track not exist',
  ARTIST_NOT_FOUND = 'Artist not found',
  ALBUM_NOT_FOUND = 'Album not found',
}

const UUID_VER = 4;

const FAVORITE_TECH_ID = 'e335ad78-2372-4500-af32-b363ba5ae713';

const IS_PUBLIC_KEY = 'isPublic';

const TYPE_REFRESH_TOKEN = 'refresh';

export {
  Errors_Messages,
  UUID_VER,
  FAVORITE_TECH_ID,
  IS_PUBLIC_KEY,
  TYPE_REFRESH_TOKEN,
};
