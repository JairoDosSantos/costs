import { prisma } from "../database/prisma";
import { ICreateGroup } from "../services/groupServices";


export interface ICreateEquipament {
    id?: number;
    description: string;
    um: string;
    group: ICreateGroup;

}


class EquipamentRepository {

    async createEquipament({ description, group, um }: ICreateEquipament) {
        console.log(group);
        try {
            const createNewEquipament = await prisma.equipment.create({
                data: {
                    description,
                    group: {
                        connect: {
                            id: group?.id,
                        }
                    },

                    um
                }
            })

            if (createNewEquipament) {
                return createNewEquipament
            }

        } catch (error: any) {

            throw new Error(error.message);

        }

    }

    async findOneEquipament(equipament: string) {

        try {
            const result = await prisma.equipment.findFirst({ where: { description: equipament }, include: { group: true } })

            return result;

        } catch (error: any) {
            throw new Error(error.message)
        }
    }

    async findAllEquipament() {

        try {

            const result = await prisma.equipment.findMany({ include: { group: true, cost: true } });

            return result;

        } catch (error) {

        }
    }


}

export { EquipamentRepository };

