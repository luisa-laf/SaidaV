import prismaClient from "../../../prisma";

class GetAllSizesServices {
  async execute() {
    const sizes = await prismaClient.size.findMany();

    return sizes;
  }
}

export { GetAllSizesServices };
