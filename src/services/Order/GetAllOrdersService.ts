import prismaClient from "../../prisma";

interface IProduct {
  id: string;
  name: string;
  image: string;
  value: number;
}

interface ISize {
  id: number;
  name: string;
}

interface IOrderedProduct {
  id: string;
  product_id: string;
  order_id: string;
  quantity: number;
  size_id: number;
  product?: IProduct;
  size?: ISize;
}

interface IUser {
  id: string;
  email: string;
  password: string;
  name: string;
  last_name: string;
  permission: string;
}

interface IOrder {
  id: string;
  value: number;
  user_id: string;
  done: boolean;
  created_at: Date;
  OrderedProducts: IOrderedProduct[];
  user?: IUser;
}

const getProductsWithSizes = (products: IOrderedProduct[]) => {
  const result = products.map((product: IOrderedProduct) => ({
    quantity: product.quantity,
    ...product.product,
    size: product.size.name,
  }));
  return result;
};

class GetAllOrdersService {
  async execute(user_id: string, isAdmin?: boolean) {
    if (isAdmin) {
      const allOrders = await prismaClient.orders.findMany({
        include: {
          OrderedProducts: {
            include: {
              product: true,
              size: true,
            },
          },
          user: true,
        },
      });

      allOrders.map((order: IOrder) => {
        delete order.user_id;
        delete order.user.password;
      });

      const filteredOrder = allOrders.map((userOrder: IOrder) => {
        const orders = getProductsWithSizes(userOrder.OrderedProducts);

        delete userOrder.OrderedProducts;

        return { ...userOrder, products: orders };
      });

      return filteredOrder;
    }

    const userOrders = await prismaClient.orders.findMany({
      where: {
        user_id: user_id,
      },
      include: {
        OrderedProducts: {
          include: {
            product: true,
            size: true,
          },
        },
      },
    });

    const filteredOrder = userOrders.map((userOrder: IOrder) => {
      delete userOrder.user_id;

      const orders = getProductsWithSizes(userOrder.OrderedProducts);

      delete userOrder.OrderedProducts;

      return { ...userOrder, products: orders };
    });

    return filteredOrder;
  }
}

export { GetAllOrdersService };
