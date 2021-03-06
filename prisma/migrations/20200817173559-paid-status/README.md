# Migration `20200817173559-paid-status`

This migration has been generated by winsonhys at 8/17/2020, 5:35:59 PM.
You can check out the [state of the schema](./schema.prisma) after the migration.

## Database Steps

```sql
CREATE TYPE "PaymentStatus" AS ENUM ('UNPAID', 'AWAITING_CATURE', 'PAID', 'REFUNDED');

ALTER TABLE "public"."Cart" DROP COLUMN "chargeId",
ADD COLUMN "paymentIntentId" text   ,
ADD COLUMN "paymentStatus" "PaymentStatus" NOT NULL DEFAULT E'UNPAID';

ALTER TABLE "public"."MultiCart" DROP COLUMN "chargeId",
ADD COLUMN "paymentIntentId" text   ,
ADD COLUMN "paymentStatus" "PaymentStatus" NOT NULL DEFAULT E'UNPAID';
```

## Changes

```diff
diff --git schema.prisma schema.prisma
migration 20200817170940-stripe_cust_id..20200817173559-paid-status
--- datamodel.dml
+++ datamodel.dml
@@ -2,9 +2,9 @@
 // learn more about it in the docs: https://pris.ly/d/prisma-schema
 datasource db {
   provider = "postgresql"
-  url = "***"
+  url = "***"
 }
 generator client {
   provider             = "prisma-client-js"
@@ -15,8 +15,15 @@
   provider = "node node_modules/typegraphql-prisma/generator.js"
   output   = "../prisma/generated/type-graphql"
 }
+enum PaymentStatus {
+  UNPAID
+  AWAITING_CATURE
+  PAID
+  REFUNDED
+}
+
 model User {
   id             String   @default(uuid()) @id
   email          String   @unique
   username       String   @unique
@@ -47,22 +54,24 @@
   cartItemCounts CartItemCount[]
 }
 model MultiCart {
-  id       String  @default(uuid()) @id
-  carts    Cart[]
-  chargeId String?
+  id              String        @default(uuid()) @id
+  carts           Cart[]
+  paymentIntentId String?
+  paymentStatus   PaymentStatus @default(UNPAID)
 }
 model Cart {
-  id             String          @default(uuid()) @id
-  ownerId        String
-  owner          User            @relation(fields: [ownerId], references: [id])
-  chargeId       String?
-  price          Float           @default(0)
-  cartItemCounts CartItemCount[]
-  MultiCart      MultiCart?      @relation(fields: [multiCartId], references: [id])
-  multiCartId    String?
+  id              String          @default(uuid()) @id
+  ownerId         String
+  owner           User            @relation(fields: [ownerId], references: [id])
+  paymentIntentId String?
+  price           Float           @default(0)
+  cartItemCounts  CartItemCount[]
+  MultiCart       MultiCart?      @relation(fields: [multiCartId], references: [id])
+  multiCartId     String?
+  paymentStatus   PaymentStatus   @default(UNPAID)
 }
 model CartItemCount {
   id        String    @default(uuid()) @id
```


