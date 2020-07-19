import {MigrationInterface, QueryRunner} from "typeorm";

export class price1595169299634 implements MigrationInterface {
    name = 'price1595169299634'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "item_order" ADD "price" integer NOT NULL DEFAULT 0`);
        await queryRunner.query(`ALTER TABLE "cart" ADD "price" integer NOT NULL DEFAULT 0`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "cart" DROP COLUMN "price"`);
        await queryRunner.query(`ALTER TABLE "item_order" DROP COLUMN "price"`);
    }

}
