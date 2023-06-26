import { prisma } from "../database/prisma";
import { ICreateGroup } from "../services/groupServices";



class GroupRepository {

    async create({ description }: ICreateGroup) {
        try {
            const createdGroup = await prisma.group.create({
                data: {
                    description
                }
            })

            if (createdGroup) {
                return createdGroup
            }

        } catch (error: any) {
            throw new Error(error.message);

        }


    }

    async findOneGroup({ description }: ICreateGroup) {

        try {
            const result = await prisma.group.findFirst({ where: { description } })

            return result;

        } catch (error: any) {
            throw new Error(error.message)
        }
    }

    async findAll() {

        try {

            const result = await prisma.group.findMany();

            return result;

        } catch (error) {

        }
    }


}

export { GroupRepository };

