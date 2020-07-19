import {MigrationInterface, QueryRunner} from "typeorm";

export class deletedOrder1595174964188 implements MigrationInterface {
    name = 'deletedOrder1595174964188'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "cart_item_count" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "count" integer NOT NULL DEFAULT 0, "price" integer NOT NULL, "itemId" uuid, "cartId" uuid, CONSTRAINT "PK_5cc9225ed1ea4474ecfa7646981" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "cart_item_count" ADD CONSTRAINT "FK_9ffaf868f9394c634f743ad90ce" FOREIGN KEY ("itemId") REFERENCES "shopping_item"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "cart_item_count" ADD CONSTRAINT "FK_ef538723deca93c1c144051620b" FOREIGN KEY ("cartId") REFERENCES "cart"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "cart_item_count" DROP CONSTRAINT "FK_ef538723deca93c1c144051620b"`);
        await queryRunner.query(`ALTER TABLE "cart_item_count" DROP CONSTRAINT "FK_9ffaf868f9394c634f743ad90ce"`);
        await queryRunner.query(`DROP TABLE "cart_item_count"`);
    }

}
