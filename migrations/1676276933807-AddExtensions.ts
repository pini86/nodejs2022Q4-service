import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddExtensions1676276933807 implements MigrationInterface {
  name = 'AddExtensions1676276933807';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP EXTENSION IF EXISTS uuid-ossp`);
  }
}
