import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateTrackDto } from './dto/create-track.dto';
import { UpdateTrackDto } from './dto/update-track.dto';
import { Track } from './entities/track.entity';
import { Errors_Messages } from '../utils/constants';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class TrackService {
  constructor(
    @InjectRepository(Track)
    private readonly tracksRepository: Repository<Track>,
  ) {}

  async getAll() {
    return this.tracksRepository.find();
  }

  async getOne(id: string) {
    const track = await this.tracksRepository.findOneBy({ id });

    if (!track) {
      throw new NotFoundException(Errors_Messages.TRACK_NOT_FOUND);
    }

    return track;
  }

  async create(createTrackDto: CreateTrackDto) {
    const track = this.tracksRepository.create(createTrackDto);
    return this.tracksRepository.save(track);
  }

  async update(id: string, updateTrackDto: UpdateTrackDto) {
    const track = Object.assign(await this.getOne(id), updateTrackDto);
    return this.tracksRepository.save(track);
  }

  async remove(id: string) {
    const track = await this.getOne(id);
    return this.tracksRepository.remove(track);
  }
}
