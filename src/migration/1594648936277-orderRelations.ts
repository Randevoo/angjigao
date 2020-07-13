import {MigrationInterface, QueryRunner} from "typeorm";

export class orderRelations1594648936277 implements MigrationInterface {
    name = 'orderRelations1594648936277'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "order" DROP CONSTRAINT "FK_17bc913318f66c5407847c1bfdd"`);
        await queryRunner.query(`ALTER TABLE "order" DROP CONSTRAINT "FK_8a583acc24e13bcf84b1b9d0d20"`);
        await queryRunner.query(`CREATE TABLE "shop" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "username" character varying NOT NULL, "dob" TIMESTAMP NOT NULL, "password" character varying NOT NULL, CONSTRAINT "PK_ad47b7c6121fe31cb4b05438e44" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "shopping_item_orders_order" ("shoppingItemId" uuid NOT NULL, "orderId" uuid NOT NULL, CONSTRAINT "PK_f3976c82504a53113212692c4c2" PRIMARY KEY ("shoppingItemId", "orderId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_c194b255ee10488a53018a38da" ON "shopping_item_orders_order" ("shoppingItemId") `);
        await queryRunner.query(`CREATE INDEX "IDX_797946ddef980f8246353b65e9" ON "shopping_item_orders_order" ("orderId") `);
        await queryRunner.query(`CREATE TABLE "order_items_shopping_item" ("orderId" uuid NOT NULL, "shoppingItemId" uuid NOT NULL, CONSTRAINT "PK_815b9b659d8de186cdba4547ff3" PRIMARY KEY ("orderId", "shoppingItemId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_a10edcf53e96850fc198a4084b" ON "order_items_shopping_item" ("orderId") `);
        await queryRunner.query(`CREATE INDEX "IDX_68bae9059907dd0262b7929c55" ON "order_items_shopping_item" ("shoppingItemId") `);
        await queryRunner.query(`ALTER TABLE "order" DROP CONSTRAINT "REL_17bc913318f66c5407847c1bfd"`);
        await queryRunner.query(`ALTER TABLE "order" DROP COLUMN "itemId"`);
        await queryRunner.query(`ALTER TABLE "order" DROP CONSTRAINT "REL_8a583acc24e13bcf84b1b9d0d2"`);
        await queryRunner.query(`ALTER TABLE "order" DROP COLUMN "sellerId"`);
        await queryRunner.query(`ALTER TABLE "shopping_item" ADD "shopId" uuid`);
        await queryRunner.query(`ALTER TABLE "order" ADD "shopId" uuid`);
        await queryRunner.query(`ALTER TABLE "order" DROP CONSTRAINT "FK_20981b2b68bf03393c44dd1b9d7"`);
        await queryRunner.query(`ALTER TABLE "order" DROP CONSTRAINT "REL_20981b2b68bf03393c44dd1b9d"`);
        await queryRunner.query(`ALTER TABLE "shopping_item" ADD CONSTRAINT "FK_e2cf59faa281506c1da4d17e5e8" FOREIGN KEY ("shopId") REFERENCES "shop"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "order" ADD CONSTRAINT "FK_20981b2b68bf03393c44dd1b9d7" FOREIGN KEY ("buyerId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "order" ADD CONSTRAINT "FK_318cc4bdeb61d336e3a01f4b767" FOREIGN KEY ("shopId") REFERENCES "shop"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "shopping_item_orders_order" ADD CONSTRAINT "FK_c194b255ee10488a53018a38dad" FOREIGN KEY ("shoppingItemId") REFERENCES "shopping_item"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "shopping_item_orders_order" ADD CONSTRAINT "FK_797946ddef980f8246353b65e91" FOREIGN KEY ("orderId") REFERENCES "order"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "order_items_shopping_item" ADD CONSTRAINT "FK_a10edcf53e96850fc198a4084bf" FOREIGN KEY ("orderId") REFERENCES "order"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "order_items_shopping_item" ADD CONSTRAINT "FK_68bae9059907dd0262b7929c552" FOREIGN KEY ("shoppingItemId") REFERENCES "shopping_item"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "order_items_shopping_item" DROP CONSTRAINT "FK_68bae9059907dd0262b7929c552"`);
        await queryRunner.query(`ALTER TABLE "order_items_shopping_item" DROP CONSTRAINT "FK_a10edcf53e96850fc198a4084bf"`);
        await queryRunner.query(`ALTER TABLE "shopping_item_orders_order" DROP CONSTRAINT "FK_797946ddef980f8246353b65e91"`);
        await queryRunner.query(`ALTER TABLE "shopping_item_orders_order" DROP CONSTRAINT "FK_c194b255ee10488a53018a38dad"`);
        await queryRunner.query(`ALTER TABLE "order" DROP CONSTRAINT "FK_318cc4bdeb61d336e3a01f4b767"`);
        await queryRunner.query(`ALTER TABLE "order" DROP CONSTRAINT "FK_20981b2b68bf03393c44dd1b9d7"`);
        await queryRunner.query(`ALTER TABLE "shopping_item" DROP CONSTRAINT "FK_e2cf59faa281506c1da4d17e5e8"`);
        await queryRunner.query(`ALTER TABLE "order" ADD CONSTRAINT "REL_20981b2b68bf03393c44dd1b9d" UNIQUE ("buyerId")`);
        await queryRunner.query(`ALTER TABLE "order" ADD CONSTRAINT "FK_20981b2b68bf03393c44dd1b9d7" FOREIGN KEY ("buyerId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "order" DROP COLUMN "shopId"`);
        await queryRunner.query(`ALTER TABLE "shopping_item" DROP COLUMN "shopId"`);
        await queryRunner.query(`ALTER TABLE "order" ADD "sellerId" uuid`);
        await queryRunner.query(`ALTER TABLE "order" ADD CONSTRAINT "REL_8a583acc24e13bcf84b1b9d0d2" UNIQUE ("sellerId")`);
        await queryRunner.query(`ALTER TABLE "order" ADD "itemId" uuid`);
        await queryRunner.query(`ALTER TABLE "order" ADD CONSTRAINT "REL_17bc913318f66c5407847c1bfd" UNIQUE ("itemId")`);
        await queryRunner.query(`DROP INDEX "IDX_68bae9059907dd0262b7929c55"`);
        await queryRunner.query(`DROP INDEX "IDX_a10edcf53e96850fc198a4084b"`);
        await queryRunner.query(`DROP TABLE "order_items_shopping_item"`);
        await queryRunner.query(`DROP INDEX "IDX_797946ddef980f8246353b65e9"`);
        await queryRunner.query(`DROP INDEX "IDX_c194b255ee10488a53018a38da"`);
        await queryRunner.query(`DROP TABLE "shopping_item_orders_order"`);
        await queryRunner.query(`DROP TABLE "shop"`);
        await queryRunner.query(`ALTER TABLE "order" ADD CONSTRAINT "FK_8a583acc24e13bcf84b1b9d0d20" FOREIGN KEY ("sellerId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "order" ADD CONSTRAINT "FK_17bc913318f66c5407847c1bfdd" FOREIGN KEY ("itemId") REFERENCES "shopping_item"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
