import { Cart } from 'src/models/Cart/Cart';
import { Shop, User } from 'src/models/User/models';
import { Order, OrderItemCount } from 'src/models/Order/models';
import { Connection } from 'typeorm';

interface OrderArgs {
  cart?: Cart;
  shop: Shop;
  buyer: User;
  itemAndCounts?: OrderItemCount[];
  charge_id?: string;
}

export async function insertNewOrder(db: Connection, args: OrderArgs) {
  const orderRepo = db.getRepository(Order);
  const { cart, charge_id, shop, buyer, itemAndCounts } = args;
  const newOrder = orderRepo.create({
    cart,
    shop,
    buyer,
    itemAndCounts: itemAndCounts ?? [],
    charge_id,
  });
  return await orderRepo.save(newOrder);
}
