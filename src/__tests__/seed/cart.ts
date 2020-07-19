import { ShoppingItem } from 'src/models/ShoppingItem/models';
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

interface CartItemCountArgs {
  cart?: Cart;
  count?: number;
  item: ShoppingItem;
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

export async function insertNewCartItemCount(db: Connection, args: CartItemCountArgs) {
  const cartItemCountRepo = db.getRepository(CartItemCount);
  const { cart, count, item } = args;
  const newCartItemCount = cartItemCountRepo.create({
    cart,
    count: count ?? 1,
    item,
  });
  newCartItemCount.price = item.price * newCartItemCount.count;
  return await cartItemCountRepo.save(newCartItemCount);
}
