import { sumBy } from 'lodash';
import { Cart, CartItemCount } from 'src/models/Cart/Cart';
import { User } from 'src/models/User/models';
import { Connection } from 'typeorm';
import { MultiCart } from 'src/models/Cart/MultiCart';

interface CartArgs {
  cartItemCounts?: CartItemCount[];
  owner: User;
  multi_cart?: MultiCart;
  charge_id?: string;
}

export async function insertNewCart(db: Connection, args: CartArgs) {
  const cartRepo = db.getRepository(Cart);
  const { cartItemCounts, owner, multi_cart, charge_id } = args;
  const newCart = cartRepo.create({
    cartItemCounts: cartItemCounts ?? [],
    owner,
    charge_id,
    multi_cart,
  });
  newCart.price = sumBy(newCart.cartItemCounts, (cartItemCount) => cartItemCount.price);

  return await cartRepo.save(newCart);
}
