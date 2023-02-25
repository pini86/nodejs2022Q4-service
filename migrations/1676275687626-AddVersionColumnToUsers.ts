import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddVersionColumnToUsers1676275687626
  implements MigrationInterface
{
  name = 'AddVersionColumnToUser11676275687626';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "user" ALTER COLUMN "version" DROP DEFAULT`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "user" ALTER COLUMN "version" SET DEFAULT '1'`,
    );
  }
}
