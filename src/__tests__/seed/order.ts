import { ShoppingItem } from 'src/models/ShoppingItem/models';
import { Cart } from 'src/models/Cart/Cart';
import { Shop, User } from 'src/models/User/models';
import { Order } from 'src/models/Order/models';
import { Connection } from 'typeorm';

interface OrderArgs {
  cart?: Cart;
  shop: Shop;
  buyer: User;
  items?: ShoppingItem[];
  charge_id?: string;
}

export async function insertNewOrder(db: Connection, args: OrderArgs) {
  const orderRepo = db.getRepository(Order);
  const { cart, charge_id, shop, buyer, items } = args;
  const newOrder = orderRepo.create({
    cart,
    shop,
    buyer,
    items: items ?? [],
    charge_id,
  });
  return await orderRepo.save(newOrder);
}
