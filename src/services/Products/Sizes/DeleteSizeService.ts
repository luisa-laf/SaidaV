import prismaClient from "../../../prisma";

class DeleteSizeService {
  async execute(id: number) {
    
    if(!Number.isInteger(id)) {
      throw {
        error: 'Invalid Size ID.',
        code: 400,
      };
    }

    try {
      await prismaClient.size.delete({
        where: {
          id,
        },
      });
    } catch (error) {
      throw {
        error: 'Size not found.',
        code: 404,
      };
    }
  }
}

export { DeleteSizeService };
