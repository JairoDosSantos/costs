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
    costcenter: ICreateCenter;
    month?: string
}

class CostRepository {

    async create({ equipament, quantity, price, total_amount, costcenter, aquisition_date, month }: ICreateCost) {

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
                    aquisition_date,
                    month
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

            const result = await prisma.cost.findMany({

                include: {
                    costcenter: true,
                    equipament: {
                        include: {
                            group: true
                        }
                    }
                }
            });

            return result;

        } catch (error: any) {

            throw new Error(error.message);
        }
    }

    async findCostByAddressAndGroup(group_id: number, costcenter_id: number, month: string) {

        try {

            const result = await prisma.cost.findMany({

                include: {
                    costcenter: true,
                    equipament: {
                        include: {
                            group: true
                        }
                    }
                },
                where: {
                    equipament: {
                        group_id,

                    },
                    costcenter_id,
                    month
                }
            })

            return result

        } catch (error: any) {
            throw new Error(error.message);

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
                orderBy: {
                    costcenter_id: "asc"
                }
            })

            return result;

        } catch (error: any) {

            throw new Error(error.message);

        }
    }

    async totalAmountInPerMonthByCostCenter(centroId: number, firstDayOfYear: Date, lastDayOfYear: Date, searchMonth = "0") {

        try {

            if (firstDayOfYear && lastDayOfYear && searchMonth != "0") {
                const result = await prisma.cost.groupBy({
                    by: ["month"],
                    where: {
                        aquisition_date: {
                            lte: lastDayOfYear,
                            gte: firstDayOfYear,
                        },
                        costcenter: {
                            id: {
                                equals: centroId
                            }
                        },
                        month: searchMonth
                    },
                    _sum: {
                        total_amount: true
                    },
                    orderBy: {
                        month: "asc"
                    }
                })

                return result

            } else {

                const result = await prisma.cost.groupBy({
                    by: ["month"],
                    where: {
                        aquisition_date: {
                            lte: lastDayOfYear,
                            gte: firstDayOfYear,
                        },
                        costcenter: {
                            id: {
                                equals: centroId
                            },

                        }
                    },
                    _sum: {
                        total_amount: true
                    },
                    orderBy: {
                        month: "asc"
                    }
                })

                return result
            }



        } catch (error: any) {

            throw new Error(error.message);

        }
    }


    async totalAmountFromCostCenterByGroup(idCostCenter: number, month = "0") {

        try {


            const result = await prisma.cost.findMany({
                include: {
                    equipament: {
                        include: {
                            group: true
                        }
                    },
                    costcenter: true
                },
                where: {
                    costcenter: {
                        id: idCostCenter
                    },
                    month
                },
                orderBy: {
                    id: "asc"
                }

            })

            return result


        } catch (error: any) {

            throw new Error(error.message);
        }
    }

}

export { CostRepository };

