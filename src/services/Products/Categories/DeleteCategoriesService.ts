import prismaClient from "../../../prisma";

class DeleteCategoriesService {
  async execute(id: number) {
    if (!Number.isInteger(id)) {
      throw {
        error: "Invalid Category ID.",
        code: 400,
      };
    }

    try {
      await prismaClient.category.delete({
        where: {
          id,
        },
      });
    } catch (error) {
      throw {
        error: "Category not found.",
        code: 404,
      };
    }
  }
}

export { DeleteCategoriesService };
