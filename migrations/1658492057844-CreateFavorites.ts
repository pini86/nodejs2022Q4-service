import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateFavorites1658492057844 implements MigrationInterface {
  name = 'CreateFavorites1658492057844';
  favoriteTechId = 'e335ad78-2372-4500-af32-b363ba5ae713';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "favorites" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "artists" character varying array NOT NULL DEFAULT '{}', "albums" character varying array NOT NULL DEFAULT '{}', "tracks" character varying array NOT NULL DEFAULT '{}', CONSTRAINT "PK_890818d27523748dd36a4d1bdc8" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `INSERT INTO favorites (id) VALUES ('${this.favoriteTechId}')`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "favorites"`);
  }
}
