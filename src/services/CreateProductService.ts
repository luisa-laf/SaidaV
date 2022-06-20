import prismaClient from "../../prisma";

interface IQuantities {
  size_id: number;
  quantity: number;
}

interface ISubmitData {
  name: string;
  value: number;
  image: string;
  description?: string;
}

class CreateProductService {
  async execute(
    name: string,
    value: number,
    image: string,
    description?: string,
    quantities?: IQuantities[],
    categories?: number[]
  ) {
    const submitData: ISubmitData = {
      name,
      value,
      image,
    };

    description && (submitData.description = description);

    const product = await prismaClient.product.create({
      data: submitData,
    });

    for (const quantity of quantities) {
      if (quantity.quantity > 0) {
        await prismaClient.quantity.create({
          data: {
            size_id: quantity.size_id,
            product_id: product.id,
            quantity: quantity.quantity,
          },
        });
      }
    }

    for (const category of categories) {
      await prismaClient.productCategory.create({
        data: {
          category_id: category,
          product_id: product.id,
        },
      });
    }

    return product;
  }
}

export { CreateProductService };



