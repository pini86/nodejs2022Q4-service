import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateTrackDto } from './dto/create-track.dto';
import * as uuid from 'uuid';
import { UpdateTrackDto } from './dto/update-track.dto';
import { Track } from './entities/track.entity';
import { Errors_Messages } from '../utils/constants';

@Injectable()
export class TrackService {
  private readonly tracks = [];

  async getAll() {
    return this.tracks;
  }

  async getOne(id: string) {
    const track = this.tracks.find((item) => item.id === id);

    if (!track) {
      throw new NotFoundException(Errors_Messages.TRACK_NOT_FOUND);
    }

    return track;
  }

  async create(createTrackDto: CreateTrackDto) {
    const newTrack = Object.assign(new Track(), {
      id: uuid.v4(),
      ...createTrackDto,
    });

    this.tracks.push(newTrack);

    return newTrack;
  }

  async update(id: string, updateTrackDto: UpdateTrackDto) {
    return Object.assign(await this.getOne(id), updateTrackDto);
  }

  async remove(id: string) {
    const index = this.tracks.findIndex((item) => item.id === id);

    if (index != -1) {
      return this.tracks.splice(index, 1)[0];
    }

    throw new NotFoundException(Errors_Messages.TRACK_NOT_FOUND);
  }

  async removeArtist(id: string) {
    this.tracks.forEach((track) => {
      if (track.artistId === id) {
        track.artistId = null;
      }
    });
  }

  async removeAlbum(id: string) {
    this.tracks.forEach((track) => {
      if (track.albumId === id) {
        track.albumId = null;
      }
    });
  }
}
