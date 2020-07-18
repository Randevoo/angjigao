import {MigrationInterface, QueryRunner} from "typeorm";

export class chargeIdNukk1595082121624 implements MigrationInterface {
    name = 'chargeIdNukk1595082121624'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "item_order" ALTER COLUMN "charge_id" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "cart" DROP CONSTRAINT "FK_74437c8abe0038366cda005444d"`);
        await queryRunner.query(`ALTER TABLE "cart" ADD CONSTRAINT "UQ_74437c8abe0038366cda005444d" UNIQUE ("ownerId")`);
        await queryRunner.query(`ALTER TABLE "cart" ADD CONSTRAINT "FK_74437c8abe0038366cda005444d" FOREIGN KEY ("ownerId") REFERENCES "user_buyer"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "cart" DROP CONSTRAINT "FK_74437c8abe0038366cda005444d"`);
        await queryRunner.query(`ALTER TABLE "cart" DROP CONSTRAINT "UQ_74437c8abe0038366cda005444d"`);
        await queryRunner.query(`ALTER TABLE "cart" ADD CONSTRAINT "FK_74437c8abe0038366cda005444d" FOREIGN KEY ("ownerId") REFERENCES "user_buyer"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "item_order" ALTER COLUMN "charge_id" SET NOT NULL`);
    }

}
