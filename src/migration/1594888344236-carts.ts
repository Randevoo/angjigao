import {MigrationInterface, QueryRunner} from "typeorm";

export class carts1594888344236 implements MigrationInterface {
    name = 'carts1594888344236'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "multi_cart" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "charge_id" character varying NOT NULL, CONSTRAINT "PK_47baf8c7c37e2e9f71d7a8c3957" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "cart" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "charge_id" character varying NOT NULL, "ownerId" uuid, "multiCartId" uuid, CONSTRAINT "PK_c524ec48751b9b5bcfbf6e59be7" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "item_order" ADD "charge_id" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "item_order" ADD "cartId" uuid`);
        await queryRunner.query(`ALTER TABLE "item_order" ADD CONSTRAINT "FK_4ef900f0653240cab235bdd9306" FOREIGN KEY ("cartId") REFERENCES "cart"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "cart" ADD CONSTRAINT "FK_74437c8abe0038366cda005444d" FOREIGN KEY ("ownerId") REFERENCES "user_buyer"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "cart" ADD CONSTRAINT "FK_8780e0760886d863763dd390ee5" FOREIGN KEY ("multiCartId") REFERENCES "multi_cart"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "cart" DROP CONSTRAINT "FK_8780e0760886d863763dd390ee5"`);
        await queryRunner.query(`ALTER TABLE "cart" DROP CONSTRAINT "FK_74437c8abe0038366cda005444d"`);
        await queryRunner.query(`ALTER TABLE "item_order" DROP CONSTRAINT "FK_4ef900f0653240cab235bdd9306"`);
        await queryRunner.query(`ALTER TABLE "item_order" DROP COLUMN "cartId"`);
        await queryRunner.query(`ALTER TABLE "item_order" DROP COLUMN "charge_id"`);
        await queryRunner.query(`DROP TABLE "cart"`);
        await queryRunner.query(`DROP TABLE "multi_cart"`);
    }

}
