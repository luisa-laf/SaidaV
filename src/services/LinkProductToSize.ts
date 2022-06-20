
import prismaClient from "../../prisma";

interface IQuantities {
  size_id: number;
  quantity: number;
}

class LinkProductToSize {
  async execute(product_id: string, quantities: IQuantities[]) {
    const product = await prismaClient.product.findFirst({
      where: { id: product_id },
    });

    if (!product) {
      throw {
        error: "Product not found.",
        code: 404,
      };
    }

    for (const quantity of quantities) {
      const productQuantity = await prismaClient.quantity.findFirst({
        where: { product_id, size_id: quantity.size_id },
      });

      if (!productQuantity) {
        if (quantity.quantity > 0) {
          await prismaClient.quantity.create({
            data: {
              product_id,
              size_id: quantity.size_id,
              quantity: quantity.quantity,
            },
          });
        }
      } else if (quantity.quantity > 0) {
        await prismaClient.quantity.update({
          data: {
            quantity: quantity.quantity,
          },
          where: {
            id: productQuantity.id,
          },
        });
      } else {
        await prismaClient.quantity.delete({
          where: {
            id: productQuantity.id,
          },
        });
      }
    }
  }
}

export { LinkProductToSize };
