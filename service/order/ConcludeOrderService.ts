import prismaClient from "../../prisma";

class ConcludeOrderService {
  async execute(user_id: string) {
    const activeOrder = await prismaClient.orders.findFirst({
      where: {
        user_id,
        done: false,
      },
    });

    try {
      await prismaClient.orders.updateMany({
        where: {
          id: activeOrder.id,
        },
        data: {
          done: true,
        },
      });
    } catch (error) {
      throw {
        error: "Active order not found.",
        code: 404,
      };
    }
  }
}

export { ConcludeOrderService };
