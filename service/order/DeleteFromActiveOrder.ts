import prismaClient from "../../prisma";

interface IProducts {
  product_id: string;
  size_id: number;
}

class DeleteFromActiveOrder {
  async execute(user_id: string, products: IProducts[]) {
    const order = await prismaClient.orders.findFirst({
      where: {
        user_id,
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

    if (!order)
      throw {
        error: "Active order not found.",
        code: 404,
      };

    let orderValue = order.value;

    for (const product of products) {
      const orderedProduct = await prismaClient.orderedProducts.findFirst({
        where: {
          order_id: order.id,
          product_id: product.product_id,
          size_id: product.size_id,
        },
        include: {
          product: true,
          size: {
            include: {
              Quantity: true,
            },
          },
        },
      });

      if (orderedProduct) {
        const productValue =
          orderedProduct.quantity * orderedProduct.product.value;

        await prismaClient.orderedProducts.delete({
          where: {
            id: orderedProduct.id,
          },
        });

        const prevQuantity = await prismaClient.quantity.findFirst({
          where: {
            product_id: product.product_id,
            size_id: product.size_id,
          },
        });

        if (!prevQuantity) {
          await prismaClient.quantity.create({
            data: {
              product_id: product.product_id,
              size_id: product.size_id,
              quantity: orderedProduct.quantity,
            },
          });
        } else {
          await prismaClient.quantity.update({
            where: {
              id: prevQuantity.id,
            },
            data: {
              quantity: prevQuantity.quantity + orderedProduct.quantity,
            },
          });
        }

        orderValue -= productValue;
      } else {
        throw {
          error: "Product not found.",
          code: 404,
        };
      }
    }

    const updatedOrder = await prismaClient.orders.update({
      where: {
        id: order.id,
      },
      data: {
        value: orderValue,
      },
    });

    return updatedOrder;
  }
}

export { DeleteFromActiveOrder };
