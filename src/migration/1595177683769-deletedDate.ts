import {MigrationInterface, QueryRunner} from "typeorm";

export class deletedDate1595177683769 implements MigrationInterface {
    name = 'deletedDate1595177683769'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "cart_item_count" ADD "deletedDate" TIMESTAMP`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "cart_item_count" DROP COLUMN "deletedDate"`);
    }

}
