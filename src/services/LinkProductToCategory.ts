import prismaClient from "../../prisma";

class LinkProductToCategory {
  async execute(product_id: string, categories: number[]) {
    const product = await prismaClient.product.findFirst({
      where: { id: product_id },
    });

    if (!product) {
      throw {
        error: "Product not found.",
        code: 404,
      };
    }

    for (const category of categories) {
      const productCategory = await prismaClient.productCategory.findFirst({
        where: { product_id, category_id: category },
      });

      if (!productCategory)
        await prismaClient.productCategory.create({
          data: {
            category_id: category,
            product_id,
          },
        });
    }
  }
}

export { LinkProductToCategory };

