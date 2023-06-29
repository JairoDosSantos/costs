import { prisma } from "../database/prisma";
import { ICreateCenter } from "../services/costCenterService";
import { ICreateEquipament } from "./EquipamentRepository";


export interface ICreateCost {
    id?: number;
    equipament: number;
    price: number;
    quantity: number;
    total_amount: number;
    aquisition_date: string;
    costcenter: ICreateCenter
}

class CostRepository {

    async create({ equipament, quantity, price, total_amount, costcenter, aquisition_date }: ICreateCost) {

        try {
            const createNewCost = await prisma.cost.create({

                data: {
                    equipament: {
                        connect: {
                            id: equipament
                        }
                    },
                    quantity,
                    price,
                    total_amount,
                    costcenter: {
                        connect: {
                            id: costcenter.id
                        }
                    },
                    aquisition_date

                }
            })

            if (createNewCost)
                return createNewCost

            return null

        } catch (error: any) {
            throw new Error(error.message);

        }

    }

    async findOneCostByEquipament(equipament: ICreateEquipament) {

        try {
            const result = await prisma.cost.findFirst({ where: { equipament } })

            return result;

        } catch (error: any) {
            throw new Error(error.message)
        }
    }

    async findAll() {

        try {

            const result = await prisma.cost.findMany();

            return result;

        } catch (error) {

        }
    }

    async totalAmountByAddresInOneMonth(initialDate: Date, finalDate: Date) {

        try {

            const result = await prisma.cost.groupBy({
                by: ["costcenter_id"],
                where: {
                    aquisition_date: {
                        lte: finalDate,
                        gte: initialDate,
                    }
                },
                _sum: {
                    total_amount: true
                },
            })
            return result;
        } catch (error) {

        }
    }

}

export { CostRepository };

