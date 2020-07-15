import {MigrationInterface, QueryRunner} from "typeorm";

export class firstMigration1594807964934 implements MigrationInterface {
    name = 'firstMigration1594807964934'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "shopping_item" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "price" integer NOT NULL, "description" character varying NOT NULL, "image_url" character varying NOT NULL, "categories" text array NOT NULL, "shopId" uuid, CONSTRAINT "PK_ba8be0884367f16abef13aa2af1" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "user_buyer" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "username" character varying NOT NULL, "dob" TIMESTAMP NOT NULL, "password" character varying NOT NULL, CONSTRAINT "PK_9dd3ad7e40236ec1d5daf4a8d2a" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "shop" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "username" character varying NOT NULL, "dob" TIMESTAMP NOT NULL, "password" character varying NOT NULL, CONSTRAINT "UQ_84afa7444b2bbf2b93079cdf44d" UNIQUE ("username"), CONSTRAINT "PK_ad47b7c6121fe31cb4b05438e44" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "item_order" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "buyerId" uuid, "shopId" uuid, CONSTRAINT "PK_30515b56911c5e27392a0c82f2e" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "shopping_item_orders_item_order" ("shoppingItemId" uuid NOT NULL, "itemOrderId" uuid NOT NULL, CONSTRAINT "PK_48a0f414a6b6749772314548dd0" PRIMARY KEY ("shoppingItemId", "itemOrderId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_0a68bf1d481d48b68e36d20e9a" ON "shopping_item_orders_item_order" ("shoppingItemId") `);
        await queryRunner.query(`CREATE INDEX "IDX_a8b741da685c181b5d7ff1c2ac" ON "shopping_item_orders_item_order" ("itemOrderId") `);
        await queryRunner.query(`ALTER TABLE "shopping_item" ADD CONSTRAINT "FK_e2cf59faa281506c1da4d17e5e8" FOREIGN KEY ("shopId") REFERENCES "shop"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "item_order" ADD CONSTRAINT "FK_d6834f46904dcf30999862d1e05" FOREIGN KEY ("buyerId") REFERENCES "user_buyer"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "item_order" ADD CONSTRAINT "FK_5956e578b034768ec3573433b53" FOREIGN KEY ("shopId") REFERENCES "shop"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "shopping_item_orders_item_order" ADD CONSTRAINT "FK_0a68bf1d481d48b68e36d20e9a2" FOREIGN KEY ("shoppingItemId") REFERENCES "shopping_item"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "shopping_item_orders_item_order" ADD CONSTRAINT "FK_a8b741da685c181b5d7ff1c2ace" FOREIGN KEY ("itemOrderId") REFERENCES "item_order"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "shopping_item_orders_item_order" DROP CONSTRAINT "FK_a8b741da685c181b5d7ff1c2ace"`);
        await queryRunner.query(`ALTER TABLE "shopping_item_orders_item_order" DROP CONSTRAINT "FK_0a68bf1d481d48b68e36d20e9a2"`);
        await queryRunner.query(`ALTER TABLE "item_order" DROP CONSTRAINT "FK_5956e578b034768ec3573433b53"`);
        await queryRunner.query(`ALTER TABLE "item_order" DROP CONSTRAINT "FK_d6834f46904dcf30999862d1e05"`);
        await queryRunner.query(`ALTER TABLE "shopping_item" DROP CONSTRAINT "FK_e2cf59faa281506c1da4d17e5e8"`);
        await queryRunner.query(`DROP INDEX "IDX_a8b741da685c181b5d7ff1c2ac"`);
        await queryRunner.query(`DROP INDEX "IDX_0a68bf1d481d48b68e36d20e9a"`);
        await queryRunner.query(`DROP TABLE "shopping_item_orders_item_order"`);
        await queryRunner.query(`DROP TABLE "item_order"`);
        await queryRunner.query(`DROP TABLE "shop"`);
        await queryRunner.query(`DROP TABLE "user_buyer"`);
        await queryRunner.query(`DROP TABLE "shopping_item"`);
    }

}
