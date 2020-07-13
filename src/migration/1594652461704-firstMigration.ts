import {MigrationInterface, QueryRunner} from "typeorm";

export class firstMigration1594652461704 implements MigrationInterface {
    name = 'firstMigration1594652461704'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "shopping_item" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "price" integer NOT NULL, "description" character varying NOT NULL, "image_url" character varying NOT NULL, "categories" text array NOT NULL, "shopId" uuid, CONSTRAINT "PK_ba8be0884367f16abef13aa2af1" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "user" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "username" character varying NOT NULL, "dob" TIMESTAMP NOT NULL, "password" character varying NOT NULL, CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "shop" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "username" character varying NOT NULL, "dob" TIMESTAMP NOT NULL, "password" character varying NOT NULL, CONSTRAINT "PK_ad47b7c6121fe31cb4b05438e44" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "order" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "buyerId" uuid, "shopId" uuid, CONSTRAINT "PK_1031171c13130102495201e3e20" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "shopping_item_orders_order" ("shoppingItemId" uuid NOT NULL, "orderId" uuid NOT NULL, CONSTRAINT "PK_f3976c82504a53113212692c4c2" PRIMARY KEY ("shoppingItemId", "orderId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_c194b255ee10488a53018a38da" ON "shopping_item_orders_order" ("shoppingItemId") `);
        await queryRunner.query(`CREATE INDEX "IDX_797946ddef980f8246353b65e9" ON "shopping_item_orders_order" ("orderId") `);
        await queryRunner.query(`ALTER TABLE "shopping_item" ADD CONSTRAINT "FK_e2cf59faa281506c1da4d17e5e8" FOREIGN KEY ("shopId") REFERENCES "shop"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "order" ADD CONSTRAINT "FK_20981b2b68bf03393c44dd1b9d7" FOREIGN KEY ("buyerId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "order" ADD CONSTRAINT "FK_318cc4bdeb61d336e3a01f4b767" FOREIGN KEY ("shopId") REFERENCES "shop"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "shopping_item_orders_order" ADD CONSTRAINT "FK_c194b255ee10488a53018a38dad" FOREIGN KEY ("shoppingItemId") REFERENCES "shopping_item"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "shopping_item_orders_order" ADD CONSTRAINT "FK_797946ddef980f8246353b65e91" FOREIGN KEY ("orderId") REFERENCES "order"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "shopping_item_orders_order" DROP CONSTRAINT "FK_797946ddef980f8246353b65e91"`);
        await queryRunner.query(`ALTER TABLE "shopping_item_orders_order" DROP CONSTRAINT "FK_c194b255ee10488a53018a38dad"`);
        await queryRunner.query(`ALTER TABLE "order" DROP CONSTRAINT "FK_318cc4bdeb61d336e3a01f4b767"`);
        await queryRunner.query(`ALTER TABLE "order" DROP CONSTRAINT "FK_20981b2b68bf03393c44dd1b9d7"`);
        await queryRunner.query(`ALTER TABLE "shopping_item" DROP CONSTRAINT "FK_e2cf59faa281506c1da4d17e5e8"`);
        await queryRunner.query(`DROP INDEX "IDX_797946ddef980f8246353b65e9"`);
        await queryRunner.query(`DROP INDEX "IDX_c194b255ee10488a53018a38da"`);
        await queryRunner.query(`DROP TABLE "shopping_item_orders_order"`);
        await queryRunner.query(`DROP TABLE "order"`);
        await queryRunner.query(`DROP TABLE "shop"`);
        await queryRunner.query(`DROP TABLE "user"`);
        await queryRunner.query(`DROP TABLE "shopping_item"`);
    }

}
