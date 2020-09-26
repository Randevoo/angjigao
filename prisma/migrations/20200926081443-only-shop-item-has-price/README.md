# Migration `20200926081443-only-shop-item-has-price`

This migration has been generated by winsonhys at 9/26/2020, 4:14:43 PM.
You can check out the [state of the schema](./schema.prisma) after the migration.

## Database Steps

```sql
ALTER TYPE "DeliveryStatus" ADD VALUE 'TO_BE_STARTED'

ALTER TABLE "public"."Order" DROP COLUMN "price"

ALTER TABLE "public"."OrderItemCount" DROP COLUMN "price"
```

## Changes

```diff
diff --git schema.prisma schema.prisma
migration 20200924065321-deliverystatuses..20200926081443-only-shop-item-has-price
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
   provider        = "prisma-client-js"
@@ -23,8 +23,9 @@
   REFUNDED
 }
 enum DeliveryStatus {
+  TO_BE_STARTED
   PREPARING
   READY
   SHIPPED
   RECEIVED
@@ -95,9 +96,8 @@
   id              String         @default(uuid()) @id
   ownerId         String
   owner           User           @relation(fields: [ownerId], references: [id])
   paymentIntentId String?
-  price           Float          @default(0)
   orderItemCount  OrderItemCount
   MultiOrder      MultiOrder?    @relation(fields: [multiOrderId], references: [id])
   multiOrderId    String?
   PaymentOrder    PaymentOrder?
@@ -109,9 +109,8 @@
   orderId   String
   order     Order     @relation(fields: [orderId], references: [id])
   itemId    String
   shopItem  ShopItem  @relation(fields: [itemId], references: [id])
-  price     Float
   count     Int
   deletedAt DateTime?
 }
```

