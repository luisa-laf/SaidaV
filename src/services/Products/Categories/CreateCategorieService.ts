import prismaClient from "../../../prisma";

class CreateCategoriesService {
  async execute(name: string) {
    try {
      const category = await prismaClient.category.create({
        data: {
          name,
        },
      });

      return category;
    } catch (e) {
      throw {
        error: "Category already registered.",
        code: 400,
      };
    }
  }
}

export { CreateCategoriesService };
