import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Album } from '../../album/entities/album.entity';
import { Artist } from '../../artist/entities/artist.entity';

@Entity('tracks')
export class Track {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ type: 'uuid', nullable: true })
  artistId: string;

  @Column({ type: 'uuid', nullable: true })
  albumId: string;

  @Column()
  duration: number;

  @ManyToOne(() => Artist, (artist) => artist.tracks, { onDelete: 'SET NULL' })
  artist: Artist;

  @ManyToOne(() => Album, (album) => album.tracks, { onDelete: 'SET NULL' })
  album: Album;
}
