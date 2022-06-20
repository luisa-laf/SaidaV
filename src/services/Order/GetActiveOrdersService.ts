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
  product: IProduct;
  size: ISize;
}

const getProductsWithSizes = (products: IOrderedProduct[]) => {
  const result = products.map((product: IOrderedProduct) => ({
    quantity: product.quantity,
    ...product.product,
    size: product.size.name,
  }));
  return result;
};

class GetActiveOrdersService {
  async execute(user_id: string) {
    try {
      const userOrder = await prismaClient.orders.findFirst({
        where: {
          user_id: user_id,
          done: false,
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

      delete userOrder.user_id;

      const orders = getProductsWithSizes(userOrder.OrderedProducts);

      delete userOrder.OrderedProducts;

      return { ...userOrder, products: orders };
    } catch (error) {
      throw {
        error: "Active order not found.",
        code: 404,
      };
    }
  }
}

export { GetActiveOrdersService };
