import {MigrationInterface, QueryRunner} from "typeorm";

export class chargeIdNullable1595082931268 implements MigrationInterface {
    name = 'chargeIdNullable1595082931268'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "cart" ALTER COLUMN "charge_id" DROP NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "cart" ALTER COLUMN "charge_id" SET NOT NULL`);
    }

}
