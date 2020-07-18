import { Cart } from 'src/models/Cart/Cart';
import { User } from 'src/models/User/models';
import { Order } from 'src/models/Order/models';
import { Connection } from 'typeorm';
import { MultiCart } from 'src/models/Cart/MultiCart';

interface CartArgs {
  orders?: Order[];
  owner: User;
  multi_cart?: MultiCart;
  charge_id?: string;
}

export async function insertNewCart(db: Connection, args: CartArgs) {
  const cartRepo = db.getRepository(Cart);
  const { orders, owner, multi_cart, charge_id } = args;
  const newCart = cartRepo.create({
    orders: orders ?? [],
    owner,
    charge_id,
    multi_cart,
  });

  return await cartRepo.save(newCart);
}
