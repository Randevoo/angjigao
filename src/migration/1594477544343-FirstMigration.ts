import {MigrationInterface, QueryRunner} from "typeorm";

export class FirstMigration1594477544343 implements MigrationInterface {
    name = 'FirstMigration1594477544343'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "user" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "username" character varying NOT NULL, "dob" TIMESTAMP NOT NULL, "password" character varying NOT NULL, CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "shopping_item" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "price" integer NOT NULL, "description" character varying NOT NULL, "image_url" character varying NOT NULL, "categories" text array NOT NULL, CONSTRAINT "PK_ba8be0884367f16abef13aa2af1" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "order" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "itemId" uuid, "buyerId" uuid, "sellerId" uuid, CONSTRAINT "REL_17bc913318f66c5407847c1bfd" UNIQUE ("itemId"), CONSTRAINT "REL_20981b2b68bf03393c44dd1b9d" UNIQUE ("buyerId"), CONSTRAINT "REL_8a583acc24e13bcf84b1b9d0d2" UNIQUE ("sellerId"), CONSTRAINT "PK_1031171c13130102495201e3e20" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "order" ADD CONSTRAINT "FK_17bc913318f66c5407847c1bfdd" FOREIGN KEY ("itemId") REFERENCES "shopping_item"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "order" ADD CONSTRAINT "FK_20981b2b68bf03393c44dd1b9d7" FOREIGN KEY ("buyerId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "order" ADD CONSTRAINT "FK_8a583acc24e13bcf84b1b9d0d20" FOREIGN KEY ("sellerId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "order" DROP CONSTRAINT "FK_8a583acc24e13bcf84b1b9d0d20"`);
        await queryRunner.query(`ALTER TABLE "order" DROP CONSTRAINT "FK_20981b2b68bf03393c44dd1b9d7"`);
        await queryRunner.query(`ALTER TABLE "order" DROP CONSTRAINT "FK_17bc913318f66c5407847c1bfdd"`);
        await queryRunner.query(`DROP TABLE "order"`);
        await queryRunner.query(`DROP TABLE "shopping_item"`);
        await queryRunner.query(`DROP TABLE "user"`);
    }

}
