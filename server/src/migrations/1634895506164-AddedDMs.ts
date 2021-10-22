import {MigrationInterface, QueryRunner} from "typeorm";

export class AddedDMs1634895506164 implements MigrationInterface {
    name = 'AddedDMs1634895506164'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "public"."room" ADD "dm" boolean`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "public"."room" DROP COLUMN "dm"`);
    }

}
