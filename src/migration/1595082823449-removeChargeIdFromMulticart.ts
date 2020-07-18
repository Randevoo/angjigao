import {MigrationInterface, QueryRunner} from "typeorm";

export class removeChargeIdFromMulticart1595082823449 implements MigrationInterface {
    name = 'removeChargeIdFromMulticart1595082823449'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "multi_cart" DROP COLUMN "charge_id"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "multi_cart" ADD "charge_id" character varying NOT NULL`);
    }

}
