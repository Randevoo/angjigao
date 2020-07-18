import {MigrationInterface, QueryRunner} from "typeorm";

export class uniqueUsername1595074268057 implements MigrationInterface {
    name = 'uniqueUsername1595074268057'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user_buyer" ADD CONSTRAINT "UQ_01efa543e960a3772f9283887a0" UNIQUE ("username")`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user_buyer" DROP CONSTRAINT "UQ_01efa543e960a3772f9283887a0"`);
    }

}
