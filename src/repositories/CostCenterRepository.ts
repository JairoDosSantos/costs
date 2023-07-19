import { prisma } from "../database/prisma";
import { ICreateCenter } from "../services/costCenterService";


type costObjectType = {
    description: string,
    estimatedBudget: number,
    id: number,
    responsible: string,
    total_amount: number,
}

class CostCenterRepository {

    async create({ description, estimatedBudget, responsible }: ICreateCenter) {

        try {

            const costCenter = await prisma.costcenter.upsert({
                where: {
                    description
                },
                update: {
                    description,
                    responsible,
                    estimatedBudget
                },
                create: {
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

            const costObject = {
                description: "",
                estimatedBudget: 0,
                id: 0,
                responsible: "",
                total_amount: 0,
            }

            const arrayCostObject: costObjectType[] = []

            const result = await prisma.costcenter.findMany({

                select: {
                    _count: {
                        select: {
                            cost: true
                        }
                    },
                    description: true,
                    estimatedBudget: true,
                    id: true,
                    responsible: true,
                    cost: true,

                },
                orderBy: {
                    id: "asc"
                }

            }).then((res) => res.map((firstObject) => {

                costObject.description = firstObject.description;
                costObject.estimatedBudget = Number(firstObject.estimatedBudget);
                costObject.id = firstObject.id;
                costObject.responsible = firstObject.responsible
                //costObject.cost.push(firstObject.cost)
                firstObject.cost.map((cost) => (
                    costObject.total_amount += Number(cost.total_amount)
                ))

                arrayCostObject.push({ ...costObject })

                Object.assign(costObject, {
                    description: "",
                    estimatedBudget: 0.0,
                    id: 0,
                    responsible: "",
                    total_amount: 0,
                })

                return arrayCostObject
                //return arrayCostObject.filter((costObject) => costObject.id != 0)
            }));

            return result;

        } catch (error: any) {
            throw new Error(error.message)
        }
    }

    async findOne(id: number) {

        try {
            const result = await prisma.costcenter.findFirst({

                select: {
                    description: true,
                    estimatedBudget: true,
                    id: true,
                    responsible: true,
                    cost: true,
                },
                where: {
                    id
                }

            })

            return result;

        } catch (error: any) {
            throw new Error(error.message)
        }
    }


}

export { CostCenterRepository };

