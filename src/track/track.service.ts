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

  async findAll() {
    return this.tracksRepository.find();
  }

  async findOne(id: string) {
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
    const track = Object.assign(await this.findOne(id), updateTrackDto);
    return this.tracksRepository.save(track);
  }

  async remove(id: string) {
    const track = await this.findOne(id);
    return this.tracksRepository.remove(track);
  }
}
