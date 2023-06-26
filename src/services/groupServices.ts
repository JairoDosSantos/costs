import { GroupRepository } from "../repositories/GroupsRepository";


export interface ICreateGroup {
    id?: number;
    description: string
}

class GroupsService extends GroupRepository {

    private groupRepository: GroupRepository;

    constructor() {
        super()
        this.groupRepository = new GroupRepository()
    }


    public getGroupRepository() {
        return this.groupRepository;
    }

    async create({ description }: ICreateGroup) {

        try {

            const groupsAlreadyExists = await this.getGroupRepository().findOneGroup({ description })

            if (groupsAlreadyExists) {
                throw new Error("Group already exists")
            }

            const createdGroup = await this.getGroupRepository().create({ description })

            return createdGroup

        } catch (error: any) {

            throw new Error(error.message)

        }
    }
}

export { GroupsService };

