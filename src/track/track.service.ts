import { Injectable, NotFoundException } from '@nestjs/common';
import { DataBaseInMemory } from '../db/exp.db';
import { CreateTrackDto } from './dto/create-track.dto';
import * as uuid from 'uuid';
import { UpdateTrackDto } from './dto/update-track.dto';
import { TrackEntity } from './entities/track.entity';

@Injectable()
export class TrackService {
  constructor(private dataBase: DataBaseInMemory) {}

  getAll() {
    return this.dataBase.tracks;
  }

  getOne(id: string) {
    const track = this.dataBase.tracks.find((item) => item.id === id);
    if (!track) {
      throw new NotFoundException('Track not found');
    }
    return track;
  }

  create(createTrackDto: CreateTrackDto) {
    const track = Object.assign(new TrackEntity(), {
      id: uuid.v4(),
      ...createTrackDto,
    });

    this.dataBase.tracks.push(track);

    return track;
  }

  update(id: string, updateTrackDto: UpdateTrackDto) {
    return Object.assign(this.getOne(id), updateTrackDto);
  }

  remove(id: string) {
    const indexTrack = this.dataBase.tracks.findIndex((item) => item.id === id);

    if (indexTrack === -1) {
      throw new NotFoundException('Track not found');
    }
    this.dataBase.tracks.splice(indexTrack, 1);

    return;
  }

  removeArtist(id: string) {
    this.dataBase.tracks.forEach((track) => {
      if (track.artistId === id) {
        track.artistId = null;
      }
    });
  }
}
