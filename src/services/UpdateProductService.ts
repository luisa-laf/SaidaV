
import prismaClient from "../../prisma";

interface IProductData {
  name?: string;
  value?: number;
  image?: string;
  description?: string;
}

interface IQuantities {
  size_id: number;
  quantity: number;
}

class UpdateProductService {
  async execute(
    product_id: string,
    name?: string,
    value?: number,
    image?: string,
    description?: string,
    quantities?: IQuantities[],
    categories?: number[]
  ) {
    const prevProduct = await prismaClient.product.findFirst({
      where: {
        id: product_id,
      },
    });

    if (!prevProduct)
      throw {
        error: "Product not found.",
        code: 404,
      };

    const productData: IProductData = {};
    name && (productData.name = name);
    value && (productData.value = value);
    image && (productData.image = image);
    description && (productData.description = description);

    await prismaClient.product.update({
      where: {
        id: product_id,
      },
      data: {
        ...productData,
      },
    });

    if (quantities) {
      const productQuantities = await prismaClient.quantity.findMany({
        where: {
          product_id,
        },
      });

      const sizesIds = [
        ...new Set(quantities.map((item: IQuantities) => item.size_id)),
      ];

      for (const productQuantity of productQuantities) {
        if (!sizesIds.includes(productQuantity.size_id))
          await prismaClient.quantity.deleteMany({
            where: {
              size_id: productQuantity.size_id,
              product_id,
            },
          });
      }

      for (const quantity of quantities) {
        const productQuantity = await prismaClient.quantity.findFirst({
          where: {
            size_id: quantity.size_id,
            product_id,
          },
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

    if (categories) {
      const productCategories = await prismaClient.productCategory.findMany({
        where: {
          product_id,
        },
      });

      for (const productCategory of productCategories) {
        if (!categories.includes(productCategory.category_id))
          await prismaClient.productCategory.delete({
            where: {
              id: productCategory.id,
            },
          });
      }

      for (const category of categories) {
        const productCategory = await prismaClient.productCategory.findFirst({
          where: {
            category_id: category,
            product_id,
          },
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
}

export { UpdateProductService };
