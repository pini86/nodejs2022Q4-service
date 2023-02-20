import { DataSource } from 'typeorm';
import { config } from './ormconfig';

export const connectionSource = new DataSource(config);

connectionSource.initialize().catch((err) => {
  console.error('Error during Data Source initialization', err);
});
