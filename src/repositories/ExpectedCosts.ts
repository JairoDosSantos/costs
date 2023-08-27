import { prisma } from "../database/prisma";
import { ICreateCenter } from "../services/costCenterService";


export interface ICreateExpectedCost {
    id?: number;
    expected_cost: number;
    costcenter: ICreateCenter;
    month: string
}

class ExpectedCostRepository {

    async create({ expected_cost, costcenter, month }: ICreateExpectedCost) {

        try {
            const createNewExpectedCost = await prisma.expectedCost.create({

                data: {
                    expected_cost
                    ,
                    costcenter: {
                        connect: {
                            id: costcenter.id
                        }
                    },
                    month
                }
            })

            if (createNewExpectedCost)
                return createNewExpectedCost

            return null

        } catch (error: any) {
            throw new Error(error.message);

        }

    }

    async findOneExpectedCostByMonth(costCenter: number, month: string) {

        try {
            const result = await prisma.expectedCost.findFirst({
                where: {
                    costcenter_id: {
                        equals: costCenter
                    },
                    month
                }
            })

            return result;

        } catch (error: any) {
            throw new Error(error.message)
        }
    }

    async findAll() {

        try {

            const result = await prisma.expectedCost.findMany({

                include: {
                    costcenter: true,

                },

            });

            return result;

        } catch (error: any) {

            throw new Error(error.message);
        }
    }






}

export { ExpectedCostRepository };

