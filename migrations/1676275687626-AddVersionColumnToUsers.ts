import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddVersionColumnToUsers1676275687626
  implements MigrationInterface
{
  name = 'AddVersionColumnToUsers11676275687626';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "users" ALTER COLUMN "version" DROP DEFAULT`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "users" ALTER COLUMN "version" SET DEFAULT '1'`,
    );
  }
}
