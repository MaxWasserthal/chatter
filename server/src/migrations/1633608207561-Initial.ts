import {MigrationInterface, QueryRunner} from "typeorm";

export class Initial1633608207561 implements MigrationInterface {
    name = 'Initial1633608207561'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "reaction" ("id" SERIAL NOT NULL, "emoji" character varying NOT NULL, "reactorId" integer, "reactionToId" integer, CONSTRAINT "PK_41fbb346da22da4df129f14b11e" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "member_room" ("id" SERIAL NOT NULL, "memberId" integer, "roomId" integer, CONSTRAINT "PK_41c44802f1b923710ddebe78d66" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "room" ("id" SERIAL NOT NULL, "title" character varying NOT NULL, "public" boolean NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "creatorId" integer, CONSTRAINT "UQ_24335bb983c2df0d4e3d44f6cca" UNIQUE ("title"), CONSTRAINT "PK_c6d46db005d623e691b2fbcba23" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "message" ("id" SERIAL NOT NULL, "content" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "creatorId" integer, "roomId" integer, "responsesId" integer, CONSTRAINT "PK_ba01f0a3e0123651915008bc578" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "role" ("id" SERIAL NOT NULL, "title" character varying NOT NULL, CONSTRAINT "UQ_4a74ca47fe1aa34a28a6db3c722" UNIQUE ("title"), CONSTRAINT "PK_b36bcfe02fc8de3c57a8b2391c2" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "member" ("id" SERIAL NOT NULL, "username" character varying NOT NULL, "password" character varying NOT NULL, "email" character varying NOT NULL, "blocked" boolean NOT NULL, "verified" boolean, "telephone" character varying, "description" character varying, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "roleId" integer, CONSTRAINT "UQ_1945f9202fcfbce1b439b47b77a" UNIQUE ("username"), CONSTRAINT "UQ_4678079964ab375b2b31849456c" UNIQUE ("email"), CONSTRAINT "PK_97cbbe986ce9d14ca5894fdc072" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "reaction" ADD CONSTRAINT "FK_a0cd625c9aafd75fa90133adccb" FOREIGN KEY ("reactorId") REFERENCES "member"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "reaction" ADD CONSTRAINT "FK_fd9efdd09ea30b461e4a15c4638" FOREIGN KEY ("reactionToId") REFERENCES "message"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "member_room" ADD CONSTRAINT "FK_f1e22981f1519d3f5278f3a5f07" FOREIGN KEY ("memberId") REFERENCES "member"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "member_room" ADD CONSTRAINT "FK_92d15461b1b163e45bd8b89d20e" FOREIGN KEY ("roomId") REFERENCES "room"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "room" ADD CONSTRAINT "FK_86e40e0afb08286884be0e6f38b" FOREIGN KEY ("creatorId") REFERENCES "member"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "message" ADD CONSTRAINT "FK_e04040c4ea7133eeddefff6417d" FOREIGN KEY ("creatorId") REFERENCES "member"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "message" ADD CONSTRAINT "FK_fdfe54a21d1542c564384b74d5c" FOREIGN KEY ("roomId") REFERENCES "room"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "message" ADD CONSTRAINT "FK_7de62af080c529a3413589cba7b" FOREIGN KEY ("responsesId") REFERENCES "message"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "member" ADD CONSTRAINT "FK_ce159f87a1a69d5c4bb9dbb2b55" FOREIGN KEY ("roleId") REFERENCES "role"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "member" DROP CONSTRAINT "FK_ce159f87a1a69d5c4bb9dbb2b55"`);
        await queryRunner.query(`ALTER TABLE "message" DROP CONSTRAINT "FK_7de62af080c529a3413589cba7b"`);
        await queryRunner.query(`ALTER TABLE "message" DROP CONSTRAINT "FK_fdfe54a21d1542c564384b74d5c"`);
        await queryRunner.query(`ALTER TABLE "message" DROP CONSTRAINT "FK_e04040c4ea7133eeddefff6417d"`);
        await queryRunner.query(`ALTER TABLE "room" DROP CONSTRAINT "FK_86e40e0afb08286884be0e6f38b"`);
        await queryRunner.query(`ALTER TABLE "member_room" DROP CONSTRAINT "FK_92d15461b1b163e45bd8b89d20e"`);
        await queryRunner.query(`ALTER TABLE "member_room" DROP CONSTRAINT "FK_f1e22981f1519d3f5278f3a5f07"`);
        await queryRunner.query(`ALTER TABLE "reaction" DROP CONSTRAINT "FK_fd9efdd09ea30b461e4a15c4638"`);
        await queryRunner.query(`ALTER TABLE "reaction" DROP CONSTRAINT "FK_a0cd625c9aafd75fa90133adccb"`);
        await queryRunner.query(`DROP TABLE "member"`);
        await queryRunner.query(`DROP TABLE "role"`);
        await queryRunner.query(`DROP TABLE "message"`);
        await queryRunner.query(`DROP TABLE "room"`);
        await queryRunner.query(`DROP TABLE "member_room"`);
        await queryRunner.query(`DROP TABLE "reaction"`);
    }

}
