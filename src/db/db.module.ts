import { Module } from '@nestjs/common';
import { DataBaseInMemory } from './exp.db';

@Module({
  providers: [DataBaseInMemory],
  exports: [DataBaseInMemory],
})
export class DBModule {}
