import { prisma } from "../database/prisma";
import { ICreateCenter } from "../services/costCenterService";




class CostCenterRepository {

    async create({ description, estimatedBudget, responsible }: ICreateCenter) {

        try {
            const costCenter = await prisma.costcenter.create({
                data: {
                    description,
                    responsible,
                    estimatedBudget

                }
            })

            if (costCenter) {
                return costCenter
            }

        } catch (error: any) {
            throw new Error(error.message);

        }


    }

    async findOneCenter({ description }: ICreateCenter) {

        try {
            const result = await prisma.costcenter.findFirst({ where: { description } })

            return result;

        } catch (error: any) {
            throw new Error(error.message)
        }
    }

    async findAll() {

        try {

            const result = await prisma.costcenter.findMany();

            return result;

        } catch (error) {

        }
    }


}

export { CostCenterRepository };

