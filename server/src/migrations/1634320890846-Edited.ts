import {MigrationInterface, QueryRunner} from "typeorm";

export class Edited1634320890846 implements MigrationInterface {
    name = 'Edited1634320890846'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "public"."message" DROP CONSTRAINT "FK_7de62af080c529a3413589cba7b"`);
        await queryRunner.query(`ALTER TABLE "public"."message" RENAME COLUMN "responsesId" TO "responseId"`);
        await queryRunner.query(`ALTER TABLE "public"."message" ADD CONSTRAINT "FK_ab982530cba24233b9a8a8b695f" FOREIGN KEY ("responseId") REFERENCES "message"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "public"."message" DROP CONSTRAINT "FK_ab982530cba24233b9a8a8b695f"`);
        await queryRunner.query(`ALTER TABLE "public"."message" RENAME COLUMN "responseId" TO "responsesId"`);
        await queryRunner.query(`ALTER TABLE "public"."message" ADD CONSTRAINT "FK_7de62af080c529a3413589cba7b" FOREIGN KEY ("responsesId") REFERENCES "message"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
