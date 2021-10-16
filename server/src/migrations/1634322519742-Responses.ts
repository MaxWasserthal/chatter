import {MigrationInterface, QueryRunner} from "typeorm";

export class Responses1634322519742 implements MigrationInterface {
    name = 'Responses1634322519742'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "public"."message" DROP CONSTRAINT "FK_ab982530cba24233b9a8a8b695f"`);
        await queryRunner.query(`ALTER TABLE "public"."message" RENAME COLUMN "responseId" TO "responseIdId"`);
        await queryRunner.query(`ALTER TABLE "public"."message" ADD CONSTRAINT "FK_d708dbd561d8cc4666ad5b43681" FOREIGN KEY ("responseIdId") REFERENCES "message"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "public"."message" DROP CONSTRAINT "FK_d708dbd561d8cc4666ad5b43681"`);
        await queryRunner.query(`ALTER TABLE "public"."message" RENAME COLUMN "responseIdId" TO "responseId"`);
        await queryRunner.query(`ALTER TABLE "public"."message" ADD CONSTRAINT "FK_ab982530cba24233b9a8a8b695f" FOREIGN KEY ("responseId") REFERENCES "message"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
