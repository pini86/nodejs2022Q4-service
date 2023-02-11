import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddVersionColumnToUsers1658521097205
  implements MigrationInterface
{
  name = 'AddVersionColumnToUsers1658521097205';

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
