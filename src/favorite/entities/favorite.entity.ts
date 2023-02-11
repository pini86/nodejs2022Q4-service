import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('favorites')
export class Favorite {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', array: true, default: [] })
  artists: string[];

  @Column({ type: 'varchar', array: true, default: [] })
  albums: string[];

  @Column({ type: 'varchar', array: true, default: [] })
  tracks: string[];
}
