import prismaClient from "../../../prisma";

class CreateSizesService {
  async execute(name: string) {
    try {
      const size = await prismaClient.size.create({
        data: {
          name,
        },
      });

      return size;
    } catch (e) {
      throw {
        error: "Size already registered.",
        code: 400,
      };
    }
  }
}

export { CreateSizesService };
