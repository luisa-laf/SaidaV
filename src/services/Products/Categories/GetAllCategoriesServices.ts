import prismaClient from "../../../prisma";

class GetAllCategoriesServices {
  async execute() {
    const categories = await prismaClient.category.findMany();

    return categories;
  }
}

export { GetAllCategoriesServices };
