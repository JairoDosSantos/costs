import { EquipamentRepository, ICreateEquipament } from "../repositories/EquipamentRepository";
import { GroupRepository } from "../repositories/GroupsRepository";



class EquipamentService extends EquipamentRepository {

    private equipament: EquipamentRepository;
    private group: GroupRepository;

    constructor() {
        super()
        this.equipament = new EquipamentRepository();
        this.group = new GroupRepository
    }


    public getEquipamentRepository() {
        return this.equipament;
    }

    public getGroupRepository() {
        return this.group;
    }

    async create({ description, group, um }: ICreateEquipament) {

        try {

            const equpamentAlreadyExists = await this.getEquipamentRepository().findOneEquipament(description)

            if (equpamentAlreadyExists) {
                throw new Error("Equipament already exists")
            }
            const groupAlreadyExists = await this.getGroupRepository().findOneGroup({ description: group.description })

            if (groupAlreadyExists) {
                const createNewEquipament = await this.getEquipamentRepository().createEquipament({ description, um, group })
                return createNewEquipament
            }

            const createNewGroup = await this.getGroupRepository().create({ description: group.description })

            if (createNewGroup) {

                const createNewEquipamentWithNewGroup = await this.getEquipamentRepository().
                    createEquipament({ description, um, group: createNewGroup })

                return createNewEquipamentWithNewGroup
            }

            return null

        } catch (error: any) {

            throw new Error(error.message)

        }
    }
}

export { EquipamentService };

