import prismaClient from "../../prisma";

class DeleteProductService {
  async execute(id: string) {
    try {
      await prismaClient.quantity.deleteMany({
        where: {
          product_id: id,
        },
      });

      await prismaClient.productCategory.deleteMany({
        where: {
          product_id: id,
        },
      });

      await prismaClient.product.delete({
        where: {
          id,
        },
      });
    } catch (error) {
      throw {
        error: "Product not found.",
        code: 404,
      };
    }
  }
}

export { DeleteProductService };

