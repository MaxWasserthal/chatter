import {MigrationInterface, QueryRunner} from "typeorm";

export class LogtimesMember1635005750243 implements MigrationInterface {
    name = 'LogtimesMember1635005750243'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "public"."logtimes" ALTER COLUMN "timeEnd" DROP NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "public"."logtimes" ALTER COLUMN "timeEnd" SET NOT NULL`);
    }

}
