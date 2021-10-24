import {MigrationInterface, QueryRunner} from "typeorm";

export class Logtimes1635002803891 implements MigrationInterface {
    name = 'Logtimes1635002803891'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "logtimes" ("id" SERIAL NOT NULL, "timeStart" TIMESTAMP NOT NULL, "timeEnd" TIMESTAMP NOT NULL, "memberId" integer, CONSTRAINT "PK_262308a002158bdcbe215002e3f" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "logtimes" ADD CONSTRAINT "FK_b58c7dad49932e243e4c5b137ab" FOREIGN KEY ("memberId") REFERENCES "member"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "logtimes" DROP CONSTRAINT "FK_b58c7dad49932e243e4c5b137ab"`);
        await queryRunner.query(`DROP TABLE "logtimes"`);
    }

}
