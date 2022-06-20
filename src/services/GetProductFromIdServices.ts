import prismaClient from "../../prisma";

interface ICategory {
  id: number;
  name: string;
}

interface ICategories {
  id: number;
  category_id: number;
  product_id: string;
  category: ICategory;
}

interface ISize {
  id: number;
  name: string;
}

interface IQuantity {
  id: number;
  size_id: number;
  quantity: number;
  product_id: string;
  size: ISize;
}

interface IProduct {
  id: string;
  name: string;
  image: string;
  value: number;
  quantity?: IQuantity[];
  categories?: ICategories[];
}

const getProductWithSizes = (product: IProduct) => {
  const sizes = product.quantity.map((quantity: IQuantity) => ({
    size_id: quantity.size_id,
    size: quantity.size.name,
    quantity: quantity.quantity,
  }));

  const categories = product.categories.map(
    (category: ICategories) => category.category
  );

  delete product.quantity;
  delete product.categories;
  return { ...product, quantities: sizes, categories };
};

class GetProductFromIdServices {
  async execute(product_id?: string) {
    const product = await prismaClient.product.findFirst({
      where: {
        id: product_id,
      },
      include: {
        quantity: {
          include: {
            size: true,
          },
        },
        categories: {
          include: {
            category: true,
          },
        },
      },
    });

    if (!product)
      throw {
        error: "Product not found.",
        code: 404,
      };

    const productWithSizes = getProductWithSizes(product);

    return productWithSizes;
  }
}

export { GetProductFromIdServices };

