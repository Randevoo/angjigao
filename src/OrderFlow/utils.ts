import { Order } from '~prisma/models';
export const calculatePriceFromOrder = (order: Order): number =>
  order.orderItemCount.count * order.orderItemCount.shopItem.price;
