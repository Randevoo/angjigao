import {MigrationInterface, QueryRunner} from "typeorm";

export class itemCountsForOrders1595089028217 implements MigrationInterface {
    name = 'itemCountsForOrders1595089028217'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "order_item_count" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "count" integer NOT NULL DEFAULT 0, "itemId" uuid, "orderId" uuid, CONSTRAINT "PK_84fe4473edc1ba533a6000da220" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "order_item_count" ADD CONSTRAINT "FK_98682379aaea2958dd6551d6913" FOREIGN KEY ("itemId") REFERENCES "shopping_item"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "order_item_count" ADD CONSTRAINT "FK_200372d5d3c9589499350745441" FOREIGN KEY ("orderId") REFERENCES "item_order"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "order_item_count" DROP CONSTRAINT "FK_200372d5d3c9589499350745441"`);
        await queryRunner.query(`ALTER TABLE "order_item_count" DROP CONSTRAINT "FK_98682379aaea2958dd6551d6913"`);
        await queryRunner.query(`DROP TABLE "order_item_count"`);
    }

}
